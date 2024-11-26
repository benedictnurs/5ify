"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";

interface LevelProps {
  level: (value: number) => void;
}

const Level: React.FC<LevelProps> = ({ level }) => (
  <div className="flex mb-6">
    <Slider
      min={1}
      max={5}
      defaultValue={[3]}
      onValueChange={(value) => level(value[0])}
    />
  </div>
);

export default Level;
