import { Link } from "react-router-dom";
import moment from "moment";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing, id }) {
  // console.log(new Date(listing.timestamp.seconds * 1000));

  const date = listing.timestamp?.toDate();
  const elapsedTime = moment(date).fromNow();
  //  console.log(date);
  //  console.log(elapsedTime);

  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 ease-in-out m-[10px]">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          src={listing.imgUrls[0]}
          alt={listing.name}
          loading="lazy"
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
        />
        <span className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg">
          {elapsedTime}
        </span>
        <div className="w-full p-[10px] ">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">
              {listing.address}
            </p>
          </div>
          <p className="font-semibold text-xl m-0 truncate">{listing.name} </p>
          <p className="text-[#3a6580] mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center space-x-3 mt-[10px]">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
