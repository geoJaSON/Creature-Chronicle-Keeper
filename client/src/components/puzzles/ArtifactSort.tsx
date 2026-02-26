import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw, Package } from "lucide-react";
import type { ArtifactSortData } from "@shared/schema";

interface Props {
  data: ArtifactSortData;
  onComplete: (success: boolean) => void;
}

export function ArtifactSort({ data, onComplete }: Props) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [wrongItems, setWrongItems] = useState<string[]>([]);

  const allPlaced = data.items.every((item) => placements[item.id]);

  const handleItemClick = (itemId: string) => {
    if (showResult) return;
    if (placements[itemId]) {
      const newPlacements = { ...placements };
      delete newPlacements[itemId];
      setPlacements(newPlacements);
      setSelectedItem(null);
      return;
    }
    setSelectedItem(itemId === selectedItem ? null : itemId);
  };

  const handleCategoryClick = (category: string) => {
    if (showResult || !selectedItem) return;
    setPlacements((prev) => ({ ...prev, [selectedItem]: category }));
    setSelectedItem(null);
  };

  const handleCheck = () => {
    const wrong = data.items
      .filter((item) => placements[item.id] !== item.category)
      .map((item) => item.id);

    if (wrong.length === 0) {
      setShowResult(true);
      setWrongItems([]);
    } else {
      setWrongItems(wrong);
      setTimeout(() => {
        setWrongItems([]);
        setPlacements({});
      }, 1500);
    }
  };

  const handleRetry = () => {
    setPlacements({});
    setSelectedItem(null);
    setShowResult(false);
    setWrongItems([]);
  };

  return (
    <div className="space-y-5">
      <div className="text-center text-sm text-muted-foreground">
        Sort each artifact into the correct category
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        {data.categories.map((category) => {
          const itemsInCategory = data.items.filter((item) => placements[item.id] === category);
          const isTarget = selectedItem !== null;
          return (
            <motion.button
              key={category}
              whileTap={isTarget ? { scale: 0.95 } : {}}
              onClick={() => handleCategoryClick(category)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 min-w-[100px] transition-colors ${
                isTarget
                  ? "border-primary/50 bg-primary/5 cursor-pointer"
                  : "border-border bg-muted/30"
              }`}
              data-testid={`category-bin-${category}`}
            >
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold">{category}</span>
              {itemsInCategory.length > 0 && (
                <div className="flex gap-1 flex-wrap justify-center">
                  {itemsInCategory.map((item) => (
                    <span
                      key={item.id}
                      className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="space-y-2">
        {data.items.map((item) => {
          const placed = !!placements[item.id];
          const isSelected = selectedItem === item.id;
          const isWrong = wrongItems.includes(item.id);

          return (
            <motion.button
              key={item.id}
              animate={isWrong ? { x: [0, -4, 4, -4, 4, 0] } : {}}
              transition={isWrong ? { duration: 0.4 } : {}}
              onClick={() => handleItemClick(item.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                isWrong
                  ? "border-destructive bg-destructive/10"
                  : isSelected
                  ? "border-primary bg-primary/5"
                  : placed
                  ? "border-border/50 bg-muted/30 opacity-60"
                  : "border-border bg-card cursor-pointer"
              }`}
              data-testid={`sort-item-${item.id}`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <span className="text-sm font-medium">{item.name}</span>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                {placed && (
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                    {placements[item.id]}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {allPlaced && !showResult && wrongItems.length === 0 && (
        <div className="flex justify-center">
          <Button onClick={handleCheck} data-testid="button-check-sort">
            Check Sorting
          </Button>
        </div>
      )}

      {wrongItems.length > 0 && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-destructive">
            <XCircle className="w-5 h-5" />
            <span className="font-semibold text-sm">Some items are in the wrong category! Resetting...</span>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-primary">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">All sorted correctly!</span>
            </div>
            <Button size="sm" onClick={() => onComplete(true)} data-testid="button-sort-continue">
              Claim reward
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {!showResult && !allPlaced && Object.keys(placements).length > 0 && wrongItems.length === 0 && (
        <div className="flex justify-center">
          <Button size="sm" variant="secondary" onClick={handleRetry} data-testid="button-retry-sort">
            <RotateCcw className="w-3 h-3 mr-1" /> Reset
          </Button>
        </div>
      )}
    </div>
  );
}
