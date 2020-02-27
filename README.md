# Star Wars GraphQL Workshop

## Setup

Install dependencies:

1. `brew install nodejs`
1. `npm install -g yarn`
1. `yarn install`

Test building:

1. `yarn build`

## Running

1. `yarn server`

Open http://localhost:3000

Explore the documentation on the right with the hello world for GraphQL.

In the left panel, paste in the following to execute the query:

```graphql
query HelloGraphQL($name: String!){
  hello(name: $name)
}
```

At the bottom of the page, click `QUERY VARIABLES` and paste in the following:

```json
{"name": "Matt"}
```

Hit the ▶️ button to execute your query!

## Tasks

### 1. Create the Person GraphQL Model

A simple version of the `Person` model with just a few fields looks like this:

```graphql
"""A character in the Star Wars universe"""
type Person {
  """The internal identifier for this object."""
  id: ID!
  """The full name of this character."""
  name: String!
  """How tall this character is (in centimeters?)"""
  height: Float!
  """How much this character weighs (in kilograms?)"""
  mass: Float!
}
```

The `ID`, `String` and `Float` types are defined by the GraphQL implementation, so we didn't need to create them. The `!` after the type means it is required (without the `!` would mean optional). This can be expressed as well with arrays. For example: `[String]!` means the array will always be present but the string is optional (an empty array would satisfy this condition). However, `[String!]!` says not only will the array be present but that at least one element will be inside.

Add this to the `src/schema.graphql` file and refresh the browser. You should now be able to find the `Person` model in the right side Documentation Tab if you search for it. But if you look in the `Query` type, theres no function you can call to fetch it.

### 2. Return a Person

In the `src/schema.graphql` file, add the following to the `Query` type:

```graphql
  """Get a specific person"""
  person(id: ID!): Person
```

Now running the following query in the left panel of the GraphiQL browser you get back a `null` person.

```graphql
query {
  person(id: 1) {
    id
    name
    height
    mass
  }
}
```

To fix this, add a resolver which will fetch the person specified. Add the following to `src/resolvers.ts` under the `Query` key.

Uncomment the import at the top of the file.

```typescript
import { Person } from "./starWarsApi";
```

Add the resolver under the `Query` key.

```typescript
    person: (_: undefined, parameters: { id: number }): Person | null => {
      return Person.find<Person>(parameters.id);
    }
```

The first parameter is the parent object, in this its case `undefined` because this is the top level already.
The second parameter is the parameters for the field, in this case the `person(id: 1)` part of the GraphQL query.
There is a third parameter missing here, which is the context object. Normally, the context can hold things like authentication or authorization info and can allow you to have a "global" state for the life of the entire query execution. Since executing a GraphQL query is just a function call, the context is passed in with this informaiton when the query is executed, allowing you to gather that information in any normal way you would do today.

Execute the above query again and you should get data! **CONGRATS ON WRITING YOUR FIRST GRAPHQL QUERY!!**

_NOTE: The console will log out `"Person.find(1)"` to show you how access to the backend is happening. More on this later._

### 3. Related Model

Enough hand-holding. Write the `World` schema and add a relationship from the `Person` to a world called `homeworld`. You will fetch it with the following query:

```graphql
query {
  person(id: 1) {
    homeworld {
      id
      name
      # Feel free to fetch more fields if you've added them to the schema for `World`
    }
  }
}
```

### 4. Circular Related Models

We want to be able to return all the starships piloted by a character. And all the characters who've piloted a ship. The reason for this is the user's entry point might be a `Person` or it might be a `Starship`, so the schema naturally creates a **Graph**. We want the following query to work:

```
query {
  person(id: 10) {
    starships {
      id
      name
      pilots {
        id
        name
        starships {
          id
          name
          # This can continue indefinately... 
        }
      }
    }
  }
}
```

This above query can be resource intensive. If we add the starship schema, we can see how much fetching is going to go on in order to fulfill this query in the console. Add the `starships` relationship to the `Person` schema then add a Starship schema like the following:

```graphql
type Starship {
  id: ID!
  name: String!
  model: String!
  pilots: [Person]!
}
```

In the console you will see the same thing getting fetched over and over again. Additionally, they are fetched one by one instead of all at once.

To fix this GraphQL recommends using a pattern called [dataloader](https://github.com/graphql/dataloader). You define a new dataloader like so:

```typescript
const PersonLoader = new DataLoader(async (keys: readonly number[]) => {
  return Person.all<Person>(...keys as number[]);
});
```

Then in your resolver you can call:

```typescript
PersonLoader.loadMany(starship.pilotIds());
```

Make this query work. Add a `starships(id: ID!): Starship` type to the `Query` type to allow the user to start at a starship first instead of a person.

### 5. Parameters

Add a parameter to the name field of `Person` to allow the name to come back as uppercased, lowercase or natural (the default). The query will look like this:

```graphql
query {
  person(id: 1) {
    name(format: UPPERCASE)
  }
}
```

The `homeworld` field before did a little bit of magic for you. The default resolver was able to find the `World` object because the property was named exactly the same on the model as it was in the GraphQL schema. If you change the GraphQL schema to `home` for example, it will stop working because the `Person` model has no field named `home`. Try this and see what happens.

To deal with name changes, you have to put in a resolver and find the data to return. Additionally, to accept parameters you also have to put in a resolver. The resolver will be installed under the `Person.name` key like so:

```typescript
  Query: {
    // ...
  },
  Person: {
    name: (person: Person, parameters: { format: StringFormat }): string => {
      return ''; // Do logic here, format has already been validated by GraphQL
    }
  }
```

The above code won't compile because the `StringFormat` enum is missing. So add it:

```typescript
enum StringFormat {
  UPPERCASE = 'UPPERCASE',
  NATURAL = 'NATURAL',
  LOWERCASE = 'LOWERCASE',
}
```

_NOTE: Because the enum definitions are the same and we've told TypeScript to use a string for the runtime implementation, these end up matching because of GraphQL's validation ensuring it matches the enum value. In order to use the more natural `number` based `enum`, you need to add resolvers for this enum to translate each of them to their corresponding runtime value. To do that, you can add something like the following which maps them:_

```typescript
  // Note: this can be done automatically by reducing the enum to invert the keys and values and then when a new
  // GraphQL schema change adds or removes to this enum it will cause an error.
  StringFormat: { // This line should be the name of your enum in your GraphQL schema
    [StringFormat[StringFormat.UPPERCASE]]: StringFormat.UPPERCASE,
    [StringFormat[StringFormat.NATURAL]]: StringFormat.NATURAL,
    [StringFormat[StringFormat.LOWERCASE]]: StringFormat.LOWERCASE,
  },
```

### 6. Interfaces

So far you have a `Person`, `Starship` and `World` schemas in your graphql file. They all have an `id` field of type `ID!` in common. If we wanted to ensure each of our schemas always had that field and that the type was a required `ID` type, we could create an interface to express this.

```graphql
interface Base {
  id: ID!
}
```

Now update the `Person`, `Starship` and `World` models to be defined as `type Person implements Base`. Try removing the `id` field from either and see how the app crashes when it reboots.

_NOTE: To get rid of the warning for `Base`'s `__resolveType`, add a `Base.__resolveType` function to your resolvers. In this function you should return the name of the class as a string for the object which is passed in as the first parameter._

### 7. Unions

A union is a joining of multiple types. The user will be required to express which fields from each of the unioned models they want and GraphQL will handle calling the right resolver.

A union can be expressed as:

```graphql
union Transportation = Starship | Vehicle
```

Implement a basic version of the `Vehicle` schema and then implement the following query:

```graphql
transportation(type: TransportationType): Transportation
```

`TransportationType` is simply an enum defined as:

```graphql
enum TransportationType {
  STARSHIP
  VEHICLE
  ALL
}
```

In the case of `STARSHIP` return `Starship.all<Starship>()`, in the case of `VEHICLE` return `Vehicle.all<Vehicle>()`, and in the case of `ALL` return:

```typescript
let starships: (Starship | Vehicle)[] = Starship.all<Starship>();
let vehicles: (Starship | Vehicle)[] = Vehicle.all<Vehicle>();
return starships.map((_, i) => [starships[i], vehicles[i]]).flat().filter((t) => t);
```

Then execute a query to get them using the following syntax. The data should alternate between `Starship`s and `Vehicle` objects.

```graphql
query {
  transportation(type: ALL) {
    ... on Starship {
      id
      name
    }
    ... on Vehicle {
      id
      name
    }
  }
}
```

### 8. Scalars

The data behind the `Person` model has a string value for `birthYear` which is expressed in the format `123BBY` which means [123 years Before Battle of Yavin](https://starwars.fandom.com/wiki/0_BBY). This string with a special format should not be represented as a string, since jibberish like `"hello"` is not valid. There are other date formats in the Star Wars universe like LY and C.R.C., but this data set does not have those so we won't handle them.

In your schema file, to define a new scalar is very easy. Just add the following anywhere:

```graphql
scalar SWYear
```

Implement a new `GraphQLScalarType` by filling in the three required functions below.

```typescript
import { GraphQLScalarType } from 'graphql';

// ...

  SWYear: new GraphQLScalarType({
    name: 'SWYear',
    description: 'Format of years in the Star Wars universe. Before the Battle of Yavin (BBY) only supported format.',
    // Return the value sent to the client
    serialize(value) {
      return fromYear(value);
    },
    // Receive the value sent from the client
    parseValue(value) {
      return toYear(value);
    },
    parseLiteral(ast) {
      if (ast.kind == Kind.STRING) {
        return toYear(ast.value)
      }
      return null;
    }
  })
```

We can then internally represent the years as the interface defined below, making our code easier to write rather than having to handle the string version everywhere. Write the functions used above.

```typescript
export enum SWCalendar {
  BBY,
  LY,
  CRC,
}

export interface SWYear {
  value: number
  calendar: SWCalendar
}

export function toYear(s: string): SWYear {
  // fill this in
}

export function fromYear(year: SWYear): string {
  // fill this in
}
```

### 9. Pagination

Make the following query work. You can use the function provided to fetch a page, `Person.list<Person>(3)` will fetch the 3rd page for example.

```graphql
query {
  people(page: 3) {
    count
    next
    previous
    results {
      id
      name
    }
  }
}
```