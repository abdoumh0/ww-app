import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Plus, Barcode } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ItemAttributes } from "../../../electron/database";

interface ItemFormProps {
  item?: ItemAttributes;
  onSave: (formData: Omit<ItemAttributes, "id">) => void;
  onCancel: () => void;
}

interface ItemCardProps {
  item: ItemAttributes;
  onEdit: (item: ItemAttributes) => void;
  onDelete: (id: string) => void;
}

interface ItemsListProps {
  items: ItemAttributes[];
  onEdit: (item: ItemAttributes) => void;
  onDelete: (id: string) => void;
}

interface InventoryPageState {
  items: ItemAttributes[];
  editingItem: ItemAttributes | null;
  showForm: boolean;
}

function ItemForm({ item, onSave, onCancel }: ItemFormProps) {
  const [code, setCode] = useState(item?.code);
  const [name, setName] = useState(item?.name || "");
  const [price, setPrice] = useState(item?.price?.toString() || "");
  const [type, setType] = useState(item?.type || "");
  const [variant, setVariant] = useState(item?.variant || "");

  const handleSubmit = (): void => {
    if (!code || !name || !price) {
      toast("Please fill in all required fields", { duration: 3500 });
      return;
    }

    const formData: Omit<ItemAttributes, "id"> = {
      code,
      name,
      price: parseInt(price),
      type: type || undefined,
      variant: variant || undefined,
    };
    onSave(formData);
    setCode("");
    setName("");
    setPrice("");
    setType("");
    setVariant("");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center text-sm font-medium text-foreground mb-1">
            Code <span className="text-red-500">*</span>
            &nbsp;&nbsp;
            <Barcode size={16} />
          </label>
          <Input
            type="number"
            onChange={(e) => setCode(e.target.value)}
            placeholder="select and scan your item's barcode"
            className="border-input"
            defaultValue={code}
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
            placeholder="DZD"
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"destructive"} size={"sm"}>
                  <Trash2 />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this item.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      variant={"destructive"}
                      // @ts-ignore // maybe can cause errors but not likely
                      onClick={() => onDelete(item.id?.toString())}
                      className="text-foreground"
                    >
                      Delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
    items: [],
    editingItem: null,
    showForm: false,
  });

  const loadItems = async (
    skip: number = 0,
    perPage: number = 20
  ): Promise<void> => {
    const items = await window.electronAPI.invoke("item:list", {
      skip,
      perPage,
    });

    setState((prev) => {
      return { ...prev, items: items };
    });
  };

  const handleSave = async (
    formData: Omit<ItemAttributes, "id">
  ): Promise<void> => {
    if (state.editingItem) {
      await window.electronAPI.invoke("item:update", {
        id: state.editingItem.id,
        ...formData,
      });
    } else {
      await window.electronAPI.invoke("item:create", formData);
    }

    loadItems();
  };

  const handleEdit = (item: ItemAttributes): void => {
    setState((prev) => ({
      ...prev,
      editingItem: item,
      showForm: true,
    }));
  };

  const handleDelete = async (id: string): Promise<void> => {
    await window.electronAPI.invoke("item:delete", { id });
    loadItems();
  };

  const handleCancel = (): void => {
    setState((prev) => ({
      ...prev,
      editingItem: null,
      showForm: false,
    }));
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="h-full bg-background p-6 overflow-scroll">
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
