import { useState } from "react";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";

export default function EditListing() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);

  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountPrice,
    latitude,
    longitude,
    images,
  } = formData;

  const params = useParams();

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You can not edit this listing!");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist!");
      }
    }

    fetchListing();
  }, [navigate, params.listingId]);

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // console.log(discountPrice, regularPrice);
    if (+discountPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discount Price should be less than Regular Price!");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("You are not allowed to upload more than 6 images!");
      return;
    }

    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;

      if (location === undefined) {
        setLoading(false);
        toast.error("Please, Enter a Valid Address!");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("The Images were not Uploaded!");
    });

    // console.log(imgUrls);
    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;

    const docRef = doc(db, "listings", params.listingId);

    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing Edited Successfully!");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Edit Listing</h1>
      <form onSubmit={onSubmit}>
        <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
        <div className="flex gap-5">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "rent" ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "sale" ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            Rent
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Title</p>
        <input
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6 focus:border-slate-600"
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Title"
          maxLength="50"
          minLength="10"
          required
        />
        <div className="flex gap-7 items-center ">
          <div className="w-full">
            <p className="text-lg mt-6 font-semibold">Bedrooms</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="20"
              required
              className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6 focus:border-slate-600"
            />
          </div>
          <div className="w-full">
            <p className="text-lg mt-6 font-semibold">Bathrooms</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="20"
              required
              className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6 focus:border-slate-600"
            />
          </div>
        </div>
        <p className="text-lg mt-6 font-semibold">Parking Spot</p>
        <div className="flex gap-5">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !parking ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              parking ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex gap-5">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !furnished ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              furnished ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-1 focus:border-slate-600"
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          maxLength="100"
          minLength="10"
          required
        />

        {!geolocationEnabled && (
          <div className="flex justify-center items-center space-x-6">
            <div className="w-full">
              <p className="text-lg mt-6 font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                min="-90"
                max="90"
                required
                className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6 focus:border-slate-600"
              />
            </div>
            <div className="w-full">
              <p className="text-lg mt-6 font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                min="-180"
                max="180"
                required
                className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6 focus:border-slate-600"
              />
            </div>
          </div>
        )}
        <p className="text-lg mt-4 font-semibold">Description</p>
        <textarea
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6 focus:border-slate-600"
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          maxLength="300"
          minLength="10"
          required
        />
        <p className="text-lg font-semibold">Offer</p>
        <div className="flex gap-5 mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !offer ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              offer ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>

        <div className="flex items-center mb-6">
          <div className="">
            <p className="text-lg font-semibold">Regular price</p>
            <div className="flex w-full justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="400000000"
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <div className="">
                  <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {offer && (
          <div>
            <p className="text-lg mt-6 font-semibold">Discounted Price</p>
            <input
              type="number"
              id="discountPrice"
              value={discountPrice}
              onChange={onChange}
              min="50"
              max="9999999999"
              required={offer}
              className="text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6 focus:border-slate-600"
            />
          </div>
        )}
        <div className="mb-6">
          <p className="text-lg  font-semibold">Images</p>
          <p className="text-gray-600">
            The first image will be the cover (max 6){" "}
          </p>
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            id="images"
            onChange={onChange}
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white rounded border border-gray-300 transition duration-150 ease-in-out"
          />
        </div>
        <button
          type="submit"
          className="w-full mb-6 bg-blue-600 text-white px-7 py-3 rounded text-sm font-medium uppercase shadow-md hover:bg-blue-700 transition duration-155 ease-in-out hover:shadow-lg active:bg-blue-800"
        >
          Edit Listing
        </button>
      </form>
    </main>
  );
}
