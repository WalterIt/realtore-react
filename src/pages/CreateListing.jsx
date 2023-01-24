import { useState } from "react";
import { Link } from "react-router-dom";

export default function CreateListing() {
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
  } = formData;

  function onChange() {}

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
      <form>
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
          <div>
            <p className="text-lg mt-6 font-semibold">Bedrooms</p>
            <input
              type="number"
              name=""
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="20"
              required
              className="text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6 focus:border-slate-600"
            />
          </div>
          <div>
            <p className="text-lg mt-6 font-semibold">Bathrooms</p>
            <input
              type="number"
              name=""
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="20"
              required
              className="text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6 focus:border-slate-600"
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

        <p className="text-lg mt-6 font-semibold">Regular Price</p>
        <div className="flex w-full items-center  gap-4">
          <input
            type="number"
            name=""
            id="regularPrice"
            value={regularPrice}
            onChange={onChange}
            min="50"
            max="9999999999"
            required
            className="text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6 focus:border-slate-600"
          />
          {type === "rent" && (
            <div className="w-full items-center justify-center">
              <p className="w-full items-center justify-center text-md whitespace-nowrap">
                $ / Month
              </p>
            </div>
          )}
        </div>

        {offer && (
          <div>
            <p className="text-lg mt-6 font-semibold">Discounted Price</p>
            <input
              type="number"
              name=""
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
          <Link
            to="/create-listing"
            className="flex items-center justify-center"
          >
            Create Listing
          </Link>
        </button>
      </form>
    </main>
  );
}
