// ActorDto GetActor(string actorType, string actorCode)
//
// Input parameters:
//   string actorType: the type of the actor;
//   string actorCode: the id identifying a single actor inside the EASTIN partner’s local system.
//
// Returns:
//   ActorDto: an object containing detailed information about a single actor (for a complete description of
//  theActorDto object see below). If no actor is found than returns the null object.

// ActorDto (* fields required):
//  string ActorCode*: the id of the actor in the EASTIN partner’s local database;
//  string OriginalFullName*: the full name of the actor in the original language;
//  string Country*: the country code of the actor in ISO 3166-1-alpha-2 code (for example “IT”, “US”, etc.);
//  dateTime InsertDate*: the insert date of the actor in the EASTIN partner’s local database;
//  dateTime LastUpdateDate*: the insert date of the actor in the EASTIN partner’s local database;
//  string ShortName*: the short name of the actor;
//  string EnglishFullName*: the full name of the actor in English;
//  string OriginalDescription: the description of the Actor in the original language;
//  string EnglishDescription: the description of the Actor in English;
//  dateTime StartDate*: the start date of the actor
//  dateTime EndDate: the end date of the actor
//  string ContactBody: the reference organization of the actor;
//  string Address: the address of the actor;
//  string PostalCode: the postal code of the actor;
//  string Town: the town of the actor;
//  string Phone: the phone of the actor;
//  string Fax: the fax of the actor;
//  string Email: the email of the actor;
//  string Skype: the Skype account name of the actor;
//  string WebSiteUrl: the Web site URL of the actor. The URL should be accessible on the Web by the end
// user’s browser;
//  string ContactPersonFullName: the complete name of the contact person for the actor;
//  string OriginalUrl: the URL of the Web page in the original language on the original EASTIN partner’s
// Web site in which the actor is presented. The URL must be accessible on the Web by the end user’s
// browser;
//  string EnglishUrl: the URL of the Web page in English on the original EASTIN partner’s Web site in which
// the actor is presented. The URL must be accessible on the Web by the end user’s browser
//  string[] SocialNetworkUrls: an array of URLs linking to the actor page inside the main social networks
// (for example Facebook, Twitter, LinkedIn, etc.);
//  string[] IcfCodes*: the array of all EASTIN ICF classification codes of the actor (for example [“b1”,
// “d2”]);
//  string[] IsoCodes*: the array of all ISO classification codes of the actor (for example [“12.22”,
// “09.03.03”]);

// TODO: Make a new map/reduce view for distinct manufacturers, keyed by ID.
