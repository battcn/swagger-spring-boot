export const SerializeJsonModel = function (schema, definitions) {
  if (!sechema) {
    return;
  }
  if (schema.type) {
    switch(schema.type) {
      case 'array':
        SerializeJsonModel(schema.items, definitions);
    }
  }
}