export const buildSort = (sort = "name-asc"): any => {
  const [sortField, sortOrder] = sort.split("-");
  const validSortFields = ["name", "price", "distance"];
  const validSortOrders: ("asc" | "desc")[] = ["asc", "desc"];

  const field = validSortFields.includes(sortField) ? sortField : "name";
  const order = validSortOrders.includes(sortOrder as "asc" | "desc") ? sortOrder : "asc";

  return {
    [field]: order === "asc" ? 1 : -1,
  };
};
