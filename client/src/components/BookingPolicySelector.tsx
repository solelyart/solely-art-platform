import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Loader2, Check } from "lucide-react";

interface BookingPolicySelectorProps {
  artistId: number;
  currentSettings?: {
    bookingBufferMinutes: number;
    advanceBookingDays: number;
    cancellationPolicy: string | null;
  };
}

const PRESET_POLICIES = {
  flexible: {
    bookingBufferMinutes: 0,
    advanceBookingDays: 90,
    cancellationPolicy: "Flexible cancellation up to 24 hours before appointment. Full refund available.",
  },
  moderate: {
    bookingBufferMinutes: 15,
    advanceBookingDays: 60,
    cancellationPolicy: "Cancellation allowed up to 48 hours before appointment. 50% refund for late cancellations.",
  },
  strict: {
    bookingBufferMinutes: 30,
    advanceBookingDays: 30,
    cancellationPolicy: "Strict cancellation policy. No refunds within 7 days of appointment.",
  },
  premium: {
    bookingBufferMinutes: 60,
    advanceBookingDays: 14,
    cancellationPolicy: "Premium service requires 72-hour cancellation notice. Deposit non-refundable.",
  },
};

export function BookingPolicySelector({ artistId, currentSettings }: BookingPolicySelectorProps) {
  const utils = trpc.useUtils();
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PRESET_POLICIES | "custom">("custom");
  const [settings, setSettings] = useState({
    bookingBufferMinutes: currentSettings?.bookingBufferMinutes ?? 15,
    advanceBookingDays: currentSettings?.advanceBookingDays ?? 60,
    cancellationPolicy: currentSettings?.cancellationPolicy ?? "",
  });

  // Update settings mutation
  const updateSettings = trpc.availability.updateSettings.useMutation({
    onSuccess: () => {
      utils.availability.getSettings.invalidate();
      alert("Booking policies updated successfully!");
    },
  });

  // Detect which preset matches current settings
  useEffect(() => {
    if (!currentSettings) return;

    for (const [key, preset] of Object.entries(PRESET_POLICIES)) {
      if (
        preset.bookingBufferMinutes === currentSettings.bookingBufferMinutes &&
        preset.advanceBookingDays === currentSettings.advanceBookingDays &&
        preset.cancellationPolicy === currentSettings.cancellationPolicy
      ) {
        setSelectedPreset(key as keyof typeof PRESET_POLICIES);
        return;
      }
    }
    setSelectedPreset("custom");
  }, [currentSettings]);

  const handlePresetSelect = (preset: keyof typeof PRESET_POLICIES) => {
    setSelectedPreset(preset);
    setSettings(PRESET_POLICIES[preset]);
  };

  const handleCustomChange = () => {
    setSelectedPreset("custom");
  };

  const handleSave = () => {
    updateSettings.mutate({
      bookingBufferMinutes: settings.bookingBufferMinutes,
      advanceBookingDays: settings.advanceBookingDays,
      cancellationPolicy: settings.cancellationPolicy || undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Preset Templates */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Preset Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(PRESET_POLICIES).map(([key, preset]) => (
            <Card
              key={key}
              className={`p-4 cursor-pointer transition-all ${
                selectedPreset === key
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handlePresetSelect(key as keyof typeof PRESET_POLICIES)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold capitalize">{key}</h4>
                {selectedPreset === key && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Buffer: {preset.bookingBufferMinutes} min</p>
                <p>• Advance: {preset.advanceBookingDays} days</p>
                <p className="text-xs mt-2">{preset.cancellationPolicy}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Settings */}
      <Card className={`p-4 ${selectedPreset === "custom" ? "border-primary" : ""}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Custom Settings
          </h3>
          {selectedPreset === "custom" && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              Active
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buffer">Booking Buffer (minutes)</Label>
              <Input
                id="buffer"
                type="number"
                min="0"
                max="120"
                value={settings.bookingBufferMinutes}
                onChange={(e) => {
                  handleCustomChange();
                  setSettings({ ...settings, bookingBufferMinutes: parseInt(e.target.value) || 0 });
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Time between appointments for preparation
              </p>
            </div>

            <div>
              <Label htmlFor="advance">Advance Booking (days)</Label>
              <Input
                id="advance"
                type="number"
                min="1"
                max="365"
                value={settings.advanceBookingDays}
                onChange={(e) => {
                  handleCustomChange();
                  setSettings({ ...settings, advanceBookingDays: parseInt(e.target.value) || 30 });
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                How far ahead clients can book
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="policy">Cancellation Policy</Label>
            <Textarea
              id="policy"
              rows={4}
              placeholder="Describe your cancellation and refund policy..."
              value={settings.cancellationPolicy}
              onChange={(e) => {
                handleCustomChange();
                setSettings({ ...settings, cancellationPolicy: e.target.value });
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will be shown to clients before booking
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          size="lg"
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Save Policies
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
