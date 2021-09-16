// ProductDto GetProduct(string productCode)
//
// Input parameters:
//   string productCode: the id of the product in the EASTIN partner’s system.
//
// Returns:
//   ProductDto: an object containing detailed information about a single product. If no product is found than returns
//  the null object.
//
// This method returns an object belonging to the class ProductDto (for a complete description of the ProductDto object
// see below). The method searches into EASTIN partner’s local databases for the product which has the id matching with
// the method parameter productCode. If no product is found the method returns the null object.
