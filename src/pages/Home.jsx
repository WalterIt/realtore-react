import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Slider from "../components/Slider";
import { db } from "../firebase";

export default function Home() {
  // Offers
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);

  useEffect(() => {
    async function fetchOfferListings() {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const querySnap = await getDocs(q);
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
  }, []);

  // Get Rent Listings
  useEffect(() => {
    async function fetchRentListings() {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("type", "==", "rent"),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setRentListings(listings);
      // console.log(listings);
    }
    fetchRentListings();
  }, []);

  // Get Rent Listings
  useEffect(() => {
    async function fetchRentListings() {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("type", "==", "rent"),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setRentListings(listings);
      // console.log(listings);
    }
    fetchRentListings();
  }, []);

  // Get Sale Listings
  useEffect(() => {
    async function fetchSaleListings() {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("type", "==", "sale"),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setSaleListings(listings);
      // console.log(listings);
    }
    fetchSaleListings();
  }, []);

  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {offerListings && offerListings.length > 0 && (
          <div className="m-2 mb-3">
            <h2 className="px-3 text-2xl mt-3 font-semibold">Recent Offers</h2>
            <Link to="/offers">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more Offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 mt-3 mb-1">
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
      </div>

      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {rentListings && rentListings.length > 0 && (
          <div className="m-2 mb-3">
            <h2 className="px-3 text-2xl mt-3 font-semibold">
              Places for Rent
            </h2>
            <Link to="/category/rent">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for Rent
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 mt-3 mb-1">
              {rentListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {saleListings && saleListings.length > 0 && (
          <div className="m-2 mb-3">
            <h2 className="px-3 text-2xl mt-3 font-semibold">
              Places for Sale
            </h2>
            <Link to="/category/sale">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for Sale
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 mt-3 mb-1">
              {saleListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
