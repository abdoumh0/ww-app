import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Plus } from "lucide-react";

interface Item {
  id: string;
  code: number;
  name: string;
  price: number;
  imagePath?: string;
  type?: string;
  variant?: string;
}

interface ItemFormProps {
  item?: Item;
  onSave: (formData: Omit<Item, "id">) => void;
  onCancel: () => void;
}

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

interface ItemsListProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

interface InventoryPageState {
  items: Item[];
  editingItem: Item | null;
  showForm: boolean;
}

const mockItems: Item[] = [
  {
    id: "1",
    code: 101,
    name: "Wireless Headphones",
    price: 8999,
    type: "Electronics",
    variant: "Black",
  },
  {
    id: "2",
    code: 102,
    name: "USB-C Cable",
    price: 1299,
    type: "Accessories",
    variant: "White",
  },
  {
    id: "3",
    code: 103,
    name: "Laptop Stand",
    price: 2499,
    type: "Office",
  },
  {
    id: "4",
    code: 104,
    name: "Mechanical Keyboard",
    price: 5999,
    type: "Electronics",
    variant: "Red Switches",
  },
  {
    id: "5",
    code: 105,
    name: "Monitor Arm",
    price: 3499,
    type: "Office",
  },
];

function ItemForm({ item, onSave, onCancel }: ItemFormProps) {
  const [code, setCode] = useState(item?.code?.toString() || "");
  const [name, setName] = useState(item?.name || "");
  const [price, setPrice] = useState(item?.price?.toString() || "");
  const [type, setType] = useState(item?.type || "");
  const [variant, setVariant] = useState(item?.variant || "");

  const handleSubmit = (): void => {
    if (!code || !name || !price) {
      alert("Please fill in all required fields");
      return;
    }

    const formData: Omit<Item, "id"> = {
      code: parseInt(code),
      name,
      price: parseInt(price),
      type: type || undefined,
      variant: variant || undefined,
    };
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Code <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g., 101"
            className="border-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Price <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 5999"
            className="border-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          className="border-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Type <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="e.g., Electronics"
            className="border-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Variant <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            type="text"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            placeholder="e.g., Black"
            className="border-input"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {item ? "Update Item" : "Add Item"}
        </Button>
        {item && (
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-input text-foreground"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  return (
    <Card className="border-border hover:border-foreground/40 transition-colors">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground">Code: {item.code}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                {item.price.toLocaleString()} DZD
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {item.type && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Type:</span>{" "}
                {item.type}
              </p>
            )}
            {item.variant && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Variant:</span>{" "}
                {item.variant}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            <Button
              onClick={() => onEdit(item)}
              size="sm"
              variant="outline"
              className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              onClick={() => onDelete(item.id)}
              size="sm"
              variant="outline"
              className="border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ItemsList({ items, onEdit, onDelete }: ItemsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">
            No items yet. Add your first item!
          </p>
        </div>
      ) : (
        items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}

function InventoryPage() {
  const [state, setState] = useState<InventoryPageState>({
    items: mockItems,
    editingItem: null,
    showForm: false,
  });

  const handleSave = (formData: Omit<Item, "id">): void => {
    if (state.editingItem) {
      setState((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === prev.editingItem?.id ? { ...item, ...formData } : item
        ),
        editingItem: null,
        showForm: false,
      }));
    } else {
      const newItem: Item = {
        id: Date.now().toString(),
        ...formData,
      };
      setState((prev) => ({
        ...prev,
        items: [newItem, ...prev.items],
        showForm: false,
      }));
    }
  };

  const handleEdit = (item: Item): void => {
    setState((prev) => ({
      ...prev,
      editingItem: item,
      showForm: true,
    }));
  };

  const handleDelete = (id: string): void => {
    if (confirm("Are you sure you want to delete this item?")) {
      setState((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      }));
    }
  };

  const handleCancel = (): void => {
    setState((prev) => ({
      ...prev,
      editingItem: null,
      showForm: false,
    }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Manage your product inventory with ease
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="border-border sticky top-6">
              <CardHeader>
                <CardTitle className="text-foreground">
                  {state.editingItem ? "Edit Item" : "Add New Item"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!state.showForm && !state.editingItem ? (
                  <Button
                    onClick={() =>
                      setState((prev) => ({ ...prev, showForm: true }))
                    }
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Item
                  </Button>
                ) : (
                  <ItemForm
                    item={state.editingItem ?? undefined}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">
                Items ({state.items.length})
              </h2>
            </div>
            <ItemsList
              items={state.items}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;
