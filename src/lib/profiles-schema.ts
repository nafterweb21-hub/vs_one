export const PROFILE_REGISTRY: Record<
  string,
  {
    modelName: string;
    displayName: string;
    immutableFields: string[];
    mandatoryFields: string[];
    uniqueFields: string[];
    searchFields: string[];
    includes?: any;
  }
> = {
  currency: {
    modelName: "currency",
    displayName: "Currency Profile",
    immutableFields: ["code", "name"],
    mandatoryFields: ["code", "name", "exchangeRate"],
    uniqueFields: ["code", "name"],
    searchFields: ["code", "name"],
  },
};
