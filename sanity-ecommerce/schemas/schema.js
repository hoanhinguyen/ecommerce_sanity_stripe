import { createSchema } from "sanity";
import { SchemaTypes } from "sanity";

import product from "./product";
import banner from "./banner";
import { schemaTypes } from ".";

export default createSchema({
    name:'default',
    types: schemaTypes.concat([product, banner]),
})

