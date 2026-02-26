import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Hammer,
  Package,
  CheckCircle,
  Lock,
  Settings,
  Zap,
  Moon,
  Cpu,
  Feather,
  Gem,
  BookOpen,
  Radio,
  Wrench,
  Sparkles,
  Camera,
  ScanLine,
  RotateCcw,
  ArrowRight,
  ChevronUp,
  FlaskConical,
  Grid2x2,
  Anchor,
  Key,
  Map as MapIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGameState } from "@/lib/gameState";
import { ARTIFACTS, GADGETS, UPGRADES } from "@/lib/gameData";
import type { ArtifactId } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { CraftingMinigame } from "@/components/CraftingMinigame";
import { useState } from "react";

const ARTIFACT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  settings: Settings,
  zap: Zap,
  moon: Moon,
  cpu: Cpu,
  feather: Feather,
  gem: Gem,
  "book-open": BookOpen,
  radio: Radio,
  "flask-conical": FlaskConical,
  "grid-2x2": Grid2x2,
  anchor: Anchor,
  key: Key,
};

const ARTIFACT_COLORS: Record<string, string> = {
  old_gear: "from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900 text-amber-700 dark:text-amber-300",
  glowing_mushroom: "from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-emerald-900 text-emerald-700 dark:text-emerald-300",
  shadow_dust: "from-slate-200 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-700 dark:text-slate-300",
  circuit_board: "from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900 text-blue-700 dark:text-blue-300",
  strange_feather: "from-pink-100 to-pink-50 dark:from-pink-950 dark:to-pink-900 text-pink-700 dark:text-pink-300",
  cave_crystal: "from-violet-100 to-violet-50 dark:from-violet-950 dark:to-violet-900 text-violet-700 dark:text-violet-300",
  ancient_book: "from-yellow-100 to-yellow-50 dark:from-yellow-950 dark:to-yellow-900 text-yellow-700 dark:text-yellow-300",
  static_chip: "from-cyan-100 to-cyan-50 dark:from-cyan-950 dark:to-cyan-900 text-cyan-700 dark:text-cyan-300",
  chemical_vial: "from-teal-100 to-teal-50 dark:from-teal-950 dark:to-teal-900 text-teal-700 dark:text-teal-300",
  pixel_shard: "from-fuchsia-100 to-fuchsia-50 dark:from-fuchsia-950 dark:to-fuchsia-900 text-fuchsia-700 dark:text-fuchsia-300",
  rusty_anchor: "from-sky-100 to-sky-50 dark:from-sky-950 dark:to-sky-900 text-sky-700 dark:text-sky-300",
  signal_fragment: "from-orange-100 to-orange-50 dark:from-orange-950 dark:to-orange-900 text-orange-700 dark:text-orange-300",
  collector_key: "from-rose-100 to-rose-50 dark:from-rose-950 dark:to-rose-900 text-rose-700 dark:text-rose-300",
};

const GADGET_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  trap_camera: Camera,
  scanner: ScanLine,
  decoder_wheel: RotateCcw,
  map: MapIcon,
};

const GADGET_COLORS: Record<string, string> = {
  trap_camera: "from-orange-500 to-amber-500",
  scanner: "from-blue-500 to-cyan-500",
  decoder_wheel: "from-purple-500 to-pink-500",
  map: "from-emerald-500 to-teal-500",
};

export default function BasePage() {
  const [activeCrafting, setActiveCrafting] = useState<(typeof GADGETS)[0] | null>(null);
  const { state, craftGadget, buyUpgrade, hasGadget } = useGameState();
  const { toast } = useToast();

  const artifacts = state.inventory.artifacts;
  const totalArtifacts = Object.values(artifacts).reduce((a, b) => a + (b || 0), 0);

  const canCraft = (recipe: { artifactId: ArtifactId; quantity: number }[]) => {
    return recipe.every(
      (req) => (artifacts[req.artifactId] || 0) >= req.quantity
    );
  };

  const handleCraft = (gadget: (typeof GADGETS)[0]) => {
    setActiveCrafting(gadget);
  };

  const handleCraftingResult = (success: boolean) => {
    if (!activeCrafting) return;

    if (success) {
      const crafted = craftGadget(activeCrafting.id, activeCrafting.recipe);
      if (crafted) {
        toast({ title: `Crafted: ${activeCrafting.name}!`, description: "One use added. Gadgets are consumed when used." });
      } else {
        toast({ title: "Missing materials", description: "Collect more artifacts.", variant: "destructive" });
      }
    } else {
      toast({
        title: "Crafting Failed",
        description: "You stopped before ruining the materials. Try again.",
        variant: "destructive",
      });
    }

    setTimeout(() => setActiveCrafting(null), 500); // Wait for dialog animation
  };

  const handleUpgrade = (upgrade: (typeof UPGRADES)[0]) => {
    const success = buyUpgrade(upgrade.id, upgrade.cost);
    if (success) {
      toast({ title: `Researched: ${upgrade.name}!`, description: "Permanent upgrade unlocked." });
    } else {
      toast({
        title: "Missing materials",
        description: "Collect more artifacts to fund this research.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
            <Hammer className="w-3.5 h-3.5" />
            Workshop
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Investigator's Base</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Craft gadgets from collected artifacts to enhance your investigative abilities.
          </p>
        </motion.div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-muted-foreground" /> Artifact Storage
            </h2>
            <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">{totalArtifacts} total</span>
          </div>

          {totalArtifacts === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center text-muted-foreground space-y-3">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <Package className="w-12 h-12 mx-auto opacity-30" />
                </motion.div>
                <div>
                  <div className="font-medium">No artifacts collected</div>
                  <div className="text-sm mt-1">Encounter creatures to gather materials for crafting.</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(ARTIFACTS) as ArtifactId[]).map((id, i) => {
                const artifact = ARTIFACTS[id];
                const count = artifacts[id] || 0;
                if (count === 0) return null;
                const IconComp = ARTIFACT_ICONS[artifact.icon] || Package;
                const colorClass = ARTIFACT_COLORS[id] || "from-muted to-muted text-foreground";
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    <Card data-testid={`card-artifact-${id}`}>
                      <CardContent className="p-3 text-center space-y-2">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center mx-auto`}>
                          <IconComp className="w-6 h-6" />
                        </div>
                        <div className="text-xs font-semibold leading-tight">{artifact.name}</div>
                        <div className="text-xs text-muted-foreground leading-tight line-clamp-2">{artifact.description}</div>
                        <Badge variant="secondary" className="text-xs">x{count}</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <Tabs defaultValue="crafting" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crafting" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" /> Crafting Bench
            </TabsTrigger>
            <TabsTrigger value="research" className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4" /> Research Station
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crafting" className="space-y-4 mt-4">
            {GADGETS.map((gadget, gi) => {
              const uses = state.inventory.gadgetUses?.[gadget.id] ?? 0;
              const craftable = canCraft(gadget.recipe);
              const GadgetIcon = GADGET_ICONS[gadget.id] || Wrench;
              const gradientClass = GADGET_COLORS[gadget.id] || "from-primary to-primary";
              return (
                <motion.div
                  key={gadget.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: gi * 0.1 }}
                >
                  <Card
                    className={`${uses > 0 ? "border-primary/40" : ""} relative overflow-visible`}
                    data-testid={`card-gadget-${gadget.id}`}
                  >
                    {uses > 0 && (
                      <div className="absolute -top-2 -right-2 min-w-[28px] h-7 px-1.5 rounded-full bg-primary flex items-center justify-center z-10 text-primary-foreground text-xs font-bold">
                        ×{uses}
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <GadgetIcon className="w-7 h-7 text-white" />
                        </div>
                        <div className="space-y-2 flex-1 min-w-0">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold">{gadget.name}</span>
                              {uses > 0 && (
                                <span className="text-xs text-muted-foreground">({uses} use{uses !== 1 ? "s" : ""})</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">{gadget.description}</p>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {gadget.recipe.map((req, ri) => {
                              const artifact = ARTIFACTS[req.artifactId];
                              const have = artifacts[req.artifactId] || 0;
                              const met = have >= req.quantity;
                              return (
                                <span key={ri}>
                                  <span
                                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border ${met
                                      ? "border-primary/30 text-primary bg-primary/10"
                                      : "border-border text-muted-foreground"
                                      }`}
                                  >
                                    {artifact.name} ({have}/{req.quantity})
                                  </span>
                                  {ri < gadget.recipe.length - 1 && (
                                    <span className="text-muted-foreground/30 mx-0.5">+</span>
                                  )}
                                </span>
                              );
                            })}
                            <ArrowRight className="w-3 h-3 text-muted-foreground/40 mx-1" />
                            <GadgetIcon className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleCraft(gadget)}
                          disabled={!craftable}
                          data-testid={`button-craft-${gadget.id}`}
                          className="flex-shrink-0"
                        >
                          {craftable ? (
                            <>
                              <Sparkles className="w-3 h-3 mr-1" /> Craft
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 mr-1" /> Craft
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>

          <TabsContent value="research" className="space-y-4 mt-4">
            {UPGRADES.map((upgrade, ui) => {
              const unlocked = !!state.upgrades?.[upgrade.id];
              const buyable = !unlocked && canCraft(upgrade.cost);
              return (
                <motion.div
                  key={upgrade.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: ui * 0.1 }}
                >
                  <Card
                    className={`${unlocked ? "border-primary bg-primary/5" : ""} relative overflow-visible`}
                    data-testid={`card-upgrade-${upgrade.id}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border ${unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <ChevronUp className="w-7 h-7" />
                        </div>
                        <div className="space-y-2 flex-1 min-w-0">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold">{upgrade.name}</span>
                              {unlocked && (
                                <Badge variant="secondary" className="bg-primary/20 text-primary border-none">Active</Badge>
                              )}
                            </div>
                            <p className="text-sm text-foreground mt-0.5">{upgrade.description}</p>
                          </div>

                          {!unlocked && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {upgrade.cost.map((req, ri) => {
                                const artifact = ARTIFACTS[req.artifactId];
                                const have = artifacts[req.artifactId] || 0;
                                const met = have >= req.quantity;
                                return (
                                  <span key={ri}>
                                    <span
                                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border ${met
                                        ? "border-primary/30 text-primary bg-primary/10"
                                        : "border-border text-muted-foreground"
                                        }`}
                                    >
                                      {artifact?.name || req.artifactId} ({have}/{req.quantity})
                                    </span>
                                    {ri < upgrade.cost.length - 1 && (
                                      <span className="text-muted-foreground/30 mx-0.5">+</span>
                                    )}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleUpgrade(upgrade)}
                          disabled={unlocked || !buyable}
                          data-testid={`button-upgrade-${upgrade.id}`}
                          variant={unlocked ? "secondary" : "default"}
                          className="flex-shrink-0"
                        >
                          {unlocked ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" /> Researched
                            </>
                          ) : buyable ? (
                            <>
                              <Sparkles className="w-3 h-3 mr-1" /> Research
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 mr-1" /> Research
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>
        </Tabs>

        <Card className="bg-muted/30 border-dashed">
          <CardContent className="px-5 py-4 space-y-2 text-xs text-muted-foreground">
            <div className="font-semibold text-foreground text-sm">How to Get Artifacts</div>
            <p>Artifacts are dropped after befriending, battling, or studying creatures.</p>
            <p>Rare creatures drop 2 artifacts instead of 1. Each creature type drops different materials.</p>
            <div className="flex items-center gap-3 flex-wrap mt-2 pt-2 border-t border-border">
              <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-blue-500" /> Tech drops: circuits, chips, gears</span>
              <span className="flex items-center gap-1"><Gem className="w-3 h-3 text-purple-500" /> Weird drops: feathers, pages, crystals</span>
            </div>
          </CardContent>
        </Card>
      </div>
      {activeCrafting && (
        <CraftingMinigame
          gadgetName={activeCrafting.name}
          open={!!activeCrafting}
          onResult={handleCraftingResult}
          onCancel={() => setActiveCrafting(null)}
        />
      )}
    </div>
  );
}
