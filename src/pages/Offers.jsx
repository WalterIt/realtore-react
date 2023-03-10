import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";
import { useState } from "react";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";

export default function Offers() {
  const [offerListings, setOfferListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastfetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    async function fetchOfferListings() {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        limit(10)
      );
      const querySnap = await getDocs(q);
      const lastVisibleListing = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisibleListing);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setOfferListings(listings);
      // console.log(listings);
    }
    fetchOfferListings();
    setLoading(false);
  }, []);

  async function onFetchMoreListings() {
    const listingsRef = collection(db, "listings");
    const q = query(
      listingsRef,
      where("offer", "==", true),
      orderBy("timestamp", "desc"),
      startAfter(lastfetchedListing),
      limit(5)
    );
    const querySnap = await getDocs(q);
    const lastVisibleListing = querySnap.docs[querySnap.docs.length - 1];
    setLastFetchedListing(lastVisibleListing);
    let listings = [];
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    setOfferListings((prevState) => [...prevState, ...listings]);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl mx-auto pt-4 space-y-6">
      {offerListings && offerListings.length > 0 && (
        <div className="m-2 mb-3">
          <h2 className="px-3 text-3xl text-center mt-3 font-bold mb-6">
            Offers
          </h2>
          {loading && <Spinner />}

          <ul className="sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 mt-3 mb-1">
            {offerListings.map((listing) => (
              <ListingItem
                key={listing.id}
                listing={listing.data}
                id={listing.id}
              />
            ))}
          </ul>
        </div>
      )}

      {lastfetchedListing && (
        <div className="flex items-center justify-center">
          <button
            onClick={onFetchMoreListings}
            className="bg-white px-3 py-1.5 text-gray-700 border-2 border-gray-300 mb-6 mt-6 rounded hover:border-slate-600 transition duration-150 ease-in-out"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
