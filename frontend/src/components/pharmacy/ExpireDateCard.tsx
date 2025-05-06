import { Package, Calendar, Trash, DollarSign, X } from "lucide-react";
import pharmacyService, { Medicine } from "../../services/pharmacy.service";
import { useState } from "react";

interface Prop {
  med: Medicine;
  handleDelete: (id: number) => void;
}

const ExpireDateCard = ({ med, handleDelete }: Prop) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div
      key={med.id}
      className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-800">{med.name}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Package className="h-3.5 w-3.5 mr-1" />
              <span>Qty: {med.stock}</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <DollarSign className="h-3.5 w-3.5 mr-1" />
              <span>Discount: {(med.discount * 100).toFixed(2)}%</span>
            </div>
          </div>
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              new Date(med.expire_date) < new Date()
                ? "bg-red-100 text-red-800"
                : new Date(med.expire_date) <
                  new Date(new Date().setMonth(new Date().getMonth() + 6))
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {new Date(med.expire_date) < new Date()
              ? "Expired"
              : Math.ceil(
                  (new Date(med.expire_date).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                ) > 30
              ? `${Math.ceil(
                  (new Date(med.expire_date).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24 * 30)
                )} months left`
              : `${Math.ceil(
                  (new Date(med.expire_date).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )} days left`}
          </span>
        </div>
      </div>
      <Modal
        isModalOpen={isModalOpen}
        currentMedicine={med}
        handleSubmit={() => {}}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>Expires on {new Date(med.expire_date).toDateString()}</span>
        </div>

        <div className="mt-4 flex space-x-2">
          {new Date(med.expire_date) < new Date() ? (
            <button
              onClick={() => handleDelete(med.id)}
              className="flex-1 p-3 bg-red-600 rounded text-white cursor-pointer hover:bg-red-900 duration-200"
            >
              Delete
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 p-3 bg-yellow-500 rounded text-white cursor-pointer hover:bg-yellow-600 duration-200"
              >
                Mark for Discount
              </button>

              <button
                onClick={() => handleDelete(med.id)}
                className="flex-none p-3 bg-red-600 rounded text-white cursor-pointer hover:bg-red-900 duration-200"
              >
                <Trash />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpireDateCard;

interface ModalProp {
  handleSubmit: () => void;
  currentMedicine: Medicine;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({ isModalOpen, currentMedicine, setIsModalOpen }: ModalProp) => {
  const [percent, setPercent] = useState<string>("");
  if (!isModalOpen) return;

  const handleSubmit = async () => {
    await pharmacyService.updateMedicine(currentMedicine.id, {
      ...currentMedicine,
      discount: Number(percent) / 100,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Discount</h3>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-1"
            >
              <div className="text-black/40">Discount Percent</div>
              <div className="text-xl">{percent}</div>
            </label>
            <input
              id="name"
              name="discount"
              type="range"
              min={0}
              max={100}
              onChange={(e) => setPercent(e.target.value)}
              required
              className="w-full"
              placeholder="50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Discount
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
