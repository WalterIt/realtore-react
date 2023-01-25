import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";
import { useEffect } from "react";
import ListingItem from "../components/ListingItem";

export default function Profile() {
  const auth = getAuth();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const [changeDetail, setChangeDetail] = useState(false);

  function onLogout() {
    auth.signOut();
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update displayName in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // Update the name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { name });
      }
      toast.success("User Profile updated!");
    } catch (error) {
      toast.error("Could not update user profile!");
    }
  }

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const userListings = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(userListings);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My profile</h1>
        <div className="w-full md:w-[50%] mt-8 px-3">
          <form>
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6 ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6"
            />

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg ">
              <p className="mb-6 ">
                Do you want to edit the user name?
                <Link
                  className="text-red-600 hover:text-red-800 transition duration-200 ease-in-out ml-2"
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                >
                  {changeDetail ? "Apply change" : "Edit"}
                </Link>
              </p>
              <p>
                <Link
                  to="/"
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
                  onClick={onLogout}
                >
                  Sign out
                </Link>
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-7 py-3 rounded text-sm font-medium uppercase shadow-sm hover:bg-blue-700 transition duration-155 ease-in-out hover:shadow-lg active:bg-blue-800"
          >
            <Link
              to="/create-listing"
              className="flex items-center justify-center"
            >
              <FcHome className="mr-2 text-2xl" /> Sell or Rent your Home
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-8 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold">My Listings</h2>
            <ul>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
