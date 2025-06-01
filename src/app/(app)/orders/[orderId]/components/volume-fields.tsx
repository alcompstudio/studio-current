"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StageOptionFormValues, VolumeUnit } from "./types";

interface VolumeFieldsProps {
  form: UseFormReturn<StageOptionFormValues>;
  units: VolumeUnit[];
  loadingUnits: boolean;
}

export const VolumeFields: React.FC<VolumeFieldsProps> = ({
  form,
  units,
  loadingUnits,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid=".47wctr">
      <FormField
        control={form.control}
        name="volume_min"
        render={({ field }) => (
          <FormItem data-oid="_j9qox9">
            <FormLabel data-oid="b.y98qd">
              Минимальный объем
            </FormLabel>
            <FormControl data-oid="cu-qwhv">
              <Input
                type="number"
                step="0.0001"
                placeholder="Мин. объем"
                {...field}
                value={field.value === null ? "" : field.value}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === ""
                      ? null
                      : parseFloat(e.target.value),
                  )
                }
                data-oid="xw59u.i"
              />
            </FormControl>
            <FormMessage data-oid="vwfrjiw" />
          </FormItem>
        )}
        data-oid="nn8d4.n"
      />

      <FormField
        control={form.control}
        name="volume_max"
        render={({ field }) => (
          <FormItem data-oid="8_n6hw1">
            <FormLabel data-oid="y_.5wif">
              Максимальный объем
            </FormLabel>
            <FormControl data-oid=".v1vxoo">
              <Input
                type="number"
                step="0.0001"
                placeholder="Макс. объем"
                {...field}
                value={field.value === null ? "" : field.value}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === ""
                      ? null
                      : parseFloat(e.target.value),
                  )
                }
                data-oid="gn15cof"
              />
            </FormControl>
            <FormMessage data-oid=".3r-yyl" />
          </FormItem>
        )}
        data-oid="qwex:pz"
      />
      
      <FormField
        control={form.control}
        name="volume_unit_id"
        render={({ field }) => (
          <FormItem data-oid="k11gvcf">
            <FormLabel data-oid="5_46zsf">
              Единица измерения объема
            </FormLabel>
            <Select
              onValueChange={(value) =>
                field.onChange(value ? parseInt(value) : null)
              }
              value={field.value?.toString() || ""}
              data-oid="3w8rv74"
            >
              <FormControl data-oid="i_1a-u4">
                <SelectTrigger data-oid="kj2s.oc">
                  <SelectValue
                    placeholder="Выберите единицу измерения"
                    data-oid="bcxo33v"
                  >
                    {field.value &&
                      units.find((unit) => unit.id === field.value)
                        ?.short_name}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent data-oid="ou4ggpo">
                {loadingUnits ? (
                  <SelectItem
                    value="loading"
                    disabled
                    data-oid="54gelrj"
                  >
                    Загрузка...
                  </SelectItem>
                ) : units.length === 0 ? (
                  <SelectItem
                    value="empty"
                    disabled
                    data-oid="nq_.bcm"
                  >
                    Нет доступных единиц измерения
                  </SelectItem>
                ) : (
                  units.map((unit) => (
                    <SelectItem
                      key={unit.id}
                      value={unit.id.toString()}
                      data-oid="8xedy1z"
                    >
                      {unit.full_name} ({unit.short_name})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage data-oid=":51638-" />
          </FormItem>
        )}
        data-oid="x194f37"
      />
    </div>
  );
};

export default VolumeFields;
