import { AlertCircle, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import pharmacyService, { Medicine } from "../../services/pharmacy.service";
import ExpireDateCard from "./ExpireDateCard";

const ExpiryTap = () => {
  const [inventory, setInventory] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const filteredMedicine = useMemo(
    () =>
      inventory.filter((med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [inventory, searchTerm]
  );

  const { showToast } = useToast();


  
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


  // Load inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await pharmacyService.getMedicines();
        setInventory(
          data.filter((med) => {
            const expireDate = new Date(med.expire_date);
            const today = new Date();
            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(today.getMonth() + 6);
            return expireDate <= sixMonthsFromNow;
          })
        );
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

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="p-4 space-y-6">
      {/* SEARCH INPUT */}
      <div className="relative">
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

      {filteredMedicine.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filteredMedicine.map((med) => (
            <ExpireDateCard handleDelete={handleDelete} key={med.id} med={med} />
          ))}
        </div>
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
        </div>
      )}
    </div>
  );
};

export default ExpiryTap;
