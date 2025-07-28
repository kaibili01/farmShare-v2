// apollo/resolvers.js

import Mutation from "./Mutation.js";
import Query from "./Query.js";  // import your Query resolvers

// If you don't have a Query.js, you can replace above with this:
// const Query = {
//   hello: () => "Hello from Apollo Server!",
// };

const resolvers = {
  Query,
  Mutation,
};

export default resolvers;
