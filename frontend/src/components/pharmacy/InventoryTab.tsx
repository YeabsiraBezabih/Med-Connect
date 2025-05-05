import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash, X, AlertCircle } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import pharmacyService, {
  Medicine,
  CreateMedicineData,
} from "../../services/pharmacy.service";
import authService from "../../services/auth.service";

const InventoryTab = () => {
  const [inventory, setInventory] = useState<Medicine[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    expire_date: "",
    requires_prescription: false,
  });

  const { showToast } = useToast();

  // Load inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await pharmacyService.getMedicines();
        setInventory(data);
        setFilteredInventory(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          showToast(error.message || "Failed to load inventory", "error");
        } else {
          showToast("Failed to load inventory", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [showToast]);

  // Handle search
  useEffect(() => {
    if (searchTerm) {
      const filtered = inventory.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInventory(filtered);
    } else {
      setFilteredInventory(inventory);
    }
  }, [searchTerm, inventory]);

  // Open modal for new medicine
  const openAddModal = () => {
    setCurrentMedicine(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      expire_date: "",
      requires_prescription: false,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing medicine
  const openEditModal = (medicine: Medicine) => {
    setCurrentMedicine(medicine);
    setFormData({
      name: medicine.name,
      description: medicine.description,
      price: medicine.price.toString(),
      stock: medicine.stock.toString(),
      expire_date: medicine.expire_date,
      requires_prescription: medicine.requires_prescription,
    });
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("handleSubmit fired");
    console.log("formData:", formData);

    if (!formData.name.trim()) {
      console.log("Name validation failed");
      throw new Error("Medicine name is required");
    }
    console.log("Passed name validation");

    if (!formData.description.trim()) {
      console.log("Description validation failed");
      throw new Error("Description is required");
    }
    console.log("Passed description validation");

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);

    console.log("Parsed price:", price, "Parsed stock:", stock);

    if (isNaN(price) || price <= 0) {
      console.log("Price validation failed");
      throw new Error("Please enter a valid price greater than 0");
    }
    if (isNaN(stock) || stock < 0) {
      console.log("Stock validation failed");
      throw new Error("Please enter a valid stock quantity (0 or greater)");
    }
    console.log("Passed price/stock validation");

    const pharmacyId = authService.getPharmacyId();
    console.log("pharmacyId:", pharmacyId);
    if (!pharmacyId) {
      console.log("Pharmacy ID validation failed");
      showToast(
        "Pharmacy profile not found. Please contact support or re-register as a pharmacy.",
        "error"
      );
      return;
    }

    const medicineData: CreateMedicineData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price,
      stock,
      expire_date: formData.expire_date,
      requires_prescription: formData.requires_prescription,
      pharmacy: pharmacyId,
    };

    console.log("Submitting medicine data:", medicineData); // Debug log

    let updatedMedicine: Medicine;

    if (currentMedicine) {
      // Update existing medicine
      updatedMedicine = await pharmacyService.updateMedicine(
        currentMedicine.id,
        medicineData
      );
      setInventory((prev) =>
        prev.map((item) =>
          item.id === currentMedicine.id ? updatedMedicine : item
        )
      );
      showToast("Medicine updated successfully", "success");
    } else {
      // Add new medicine
      try {
        updatedMedicine = await pharmacyService.createMedicine(medicineData);
        setInventory((prev) => [...prev, updatedMedicine]);
        showToast("Medicine added successfully", "success");
      } catch (error: unknown) {
        console.error("Error creating medicine:", error); // Debug log
        if (
          typeof error === "object" &&
          error &&
          "response" in error &&
          (error as { response?: { status?: number } }).response?.status === 400
        ) {
          const err = error as {
            response?: { data?: { pharmacy?: string[]; message?: string } };
          };
          const errorMessage =
            err.response?.data?.pharmacy?.[0] ||
            err.response?.data?.message ||
            "Invalid medicine data. Please check all fields.";
          throw new Error(errorMessage);
        }
        if (error instanceof Error) throw error;
        throw new Error("Failed to save medicine");
      }
    }

    // Close modal
    setIsModalOpen(false);
  };

  // Handle medicine deletion
  const handleDelete = async (medicineId: number) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await pharmacyService.deleteMedicine(medicineId);
        setInventory((prev) =>
          prev.filter((medicine) => medicine.id !== medicineId)
        );
        showToast("Medicine deleted successfully", "success");
      } catch (error: unknown) {
        if (error instanceof Error) {
          showToast(error.message || "Failed to delete medicine", "error");
        } else {
          showToast("Failed to delete medicine", "error");
        }
      }
    }
  };

  if (!authService.getPharmacyId()) {
    return (
      <div className="p-6 text-red-600">
        Pharmacy profile not found. Please contact support or re-register as a
        pharmacy.
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="p-6 border-b flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="h-5 w-5" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredInventory.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicine Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price (ETB)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expire Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prescription Required
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((medicine) => (
                <tr key={medicine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {medicine.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {medicine.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof medicine.price === "number"
                      ? medicine.price.toFixed(2)
                      : !isNaN(parseFloat(medicine.price))
                      ? parseFloat(medicine.price).toFixed(2)
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        medicine.stock > 10
                          ? "bg-green-100 text-green-800"
                          : medicine.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {medicine.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        new Date(medicine.expire_date) < new Date()
                          ? "bg-red-100 text-red-800"
                          : new Date(medicine.expire_date) <
                            new Date(
                              new Date().setMonth(new Date().getMonth() + 6)
                            )
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {new Date(medicine.expire_date).toDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(medicine.discount * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medicine.requires_prescription ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => openEditModal(medicine)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(medicine.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No medicines found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? `No medicines match your search for "${searchTerm}"`
                : "Your inventory is empty. Add medicines to get started."}
            </p>
            {!searchTerm && (
              <button onClick={openAddModal} className="btn-primary mt-4">
                Add Medicine
              </button>
            )}
          </div>
        )}
      </div>

      {/* Medicine Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {currentMedicine ? "Edit Medicine" : "Add New Medicine"}
              </h3>
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
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Medicine Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="input"
                  placeholder="Enter medicine name"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="input h-24"
                  placeholder="Enter medicine description"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price (ETB)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Stock Quantity
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, stock: e.target.value }))
                  }
                  className="input"
                  placeholder="0"
                />
              </div>

              <div>
                <label
                  htmlFor="expire"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expire Date
                </label>
                <input
                  id="expire"
                  name="expire_date"
                  type="date"
                  required
                  value={formData.expire_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expire_date: e.target.value,
                    }))
                  }
                  className="input"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="requires_prescription"
                  name="requires_prescription"
                  type="checkbox"
                  checked={formData.requires_prescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      requires_prescription: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="requires_prescription"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Requires Prescription
                </label>
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
                  {currentMedicine ? "Update" : "Add"} Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTab;
