import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { MdOutlineDeleteOutline } from "react-icons/md";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const proceedToCheckout = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout", { state: { orders: cart } });
    }
  };
  // console.log(cart)
  const handleRemove = async (id) => {
    await removeFromCart(id);
  };

  if (cart.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-600 bg-gradient-to-br from-pink-50 to-purple-50 relative overflow-hidden">
        <div className="absolute rounded-full opacity-20 w-[220px] h-[220px] bg-pink-200 top-[60px] right-[10%]" />
        <div className="absolute rounded-full opacity-20 w-[160px] h-[160px] bg-purple-200 bottom-[50px] left-[12%]" />
        <div className="absolute rounded-full opacity-10 w-[100px] h-[100px] bg-pink-300 bottom-[140px] right-[30%]" />

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">
          Your Cart is Empty 🛒
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const totalCost = cart.reduce((sum, item) => sum + item?.totalCost, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-6 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6">
          My Cart
        </h1>

        {/* Cart List */}
        <ul className="space-y-6">
          {cart.map((item) => (
            <li
              key={item.id || item._id}
              className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 p-4 sm:p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition"
            >
              {/* Left: Image + Info */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border shadow-sm"
                />
                <div className="flex flex-col flex-1">
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    {item.description}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Price:{" "}
                    <span className="font-medium">
                      ₹{item.unitCost?.toFixed(2) || 0}
                    </span>
                  </p>

                  {/* Accessory details */}
                  {item.categoryType === "accessory" && (
                    <div className="text-gray-700 text-sm mt-2 space-y-1">
                      <p>
                        Size: <span className="font-medium">{item.size}</span>
                      </p>
                      <p>
                        Color: <span className="font-medium">{item.color}</span>
                      </p>
                      {item.customizations && (
                        <p>Customizations: {item.customizations}</p>
                      )}
                    </div>
                  )}

                  {/* Document details */}
                  {item.categoryType === "document" && (
                    <div className="text-gray-700 text-sm mt-2 space-y-1">
                      <p>Copies: {item.numCopies}</p>
                      <p>Paper Type: {item.paperType}</p>
                      <p>Binding: {item.binding}</p>
                      <p>Lamination: {item.lamination}</p>
                      <p>Printed Sides: {item.printedSides}</p>
                      <p>Total Pages: {item.totalPages}</p>
                      {item.files?.length > 0 && (
                        <ul className="text-xs text-blue-600 mt-1 space-y-0.5">
                          {item.files.map((f,i) => (
                            <li key={f?._id}>
                              <a
                                href={f.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2"
                              >
                                <span>📄</span>
                                <span>Uploaded Document {i+1}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}

                    </div>
                  )}

                  {/* Quantity controls */}
                  <div className="flex items-center mt-3 space-x-2">
                    <button
                      title="decrement"
                      onClick={() =>
                        updateQuantity(
                          item.id || item._id,
                          Math.max(1, (item.numCopies || 1) - 1)
                        )
                      }
                      className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.numCopies || 1}
                      onChange={(e) =>
                        updateQuantity(
                          item.id || item._id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-14 text-center border rounded-lg py-1 focus:ring focus:ring-blue-300"
                    />
                    <button
                      title="increment"
                      onClick={() =>
                        updateQuantity(
                          item.id || item._id,
                          (item.numCopies || 1) + 1
                        )
                      }
                      className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Subtotal + Remove */}
              <div className="flex flex-col items-start md:items-end space-y-2 w-full md:w-40">
                <div className="flex justify-between items-center w-full">
                  <span className="text-lg font-semibold text-gray-800">
                    Subtotal:
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    ₹{item?.totalCost?.toFixed(2)}
                  </span>
                </div>
                <button
                  title="remove"
                  onClick={() => handleRemove(item.id || item._id)}
                  className="flex items-center px-3 py-1 text-sm rounded-sm text-red-600 bg-red-100 hover:bg-red-200 transition-colors shadow-sm"
                >
                  <MdOutlineDeleteOutline />Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-8 sticky bottom-0 bg-white border-t py-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <p className="text-xl font-bold text-gray-900">
            Total: ₹{totalCost.toFixed(2)}
          </p>
          <button
            onClick={proceedToCheckout}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
