"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function Settings() {
  const [ruleValue, setRuleValue] = useState(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);
  const [savedFilters, setSavedFilters] = useState([]);

  function handleAddRule() {
    if (ruleValue != null && value != "") {
      let currentFilter = JSON.parse(localStorage.getItem("filters")) || [];
      let newData = {
        rule: ruleValue,
        value: value,
        id: Math.random().toString(36).substring(2, 15),
      };
      currentFilter.push(newData);
      localStorage.setItem("filters", JSON.stringify(currentFilter));
      setRuleValue(null);
      setValue("");
      setError(null);
      setSavedFilters((savedFilters) => [...savedFilters, newData]);
    } else {
      setError("Please fill out the fields");
    }
  }

  function handleRemoveRule(id) {
    let currentFilter = JSON.parse(localStorage.getItem("filters")) || [];
    currentFilter = currentFilter.filter((filter) => filter.id !== id);
    localStorage.setItem("filters", JSON.stringify(currentFilter));
    setSavedFilters(currentFilter);
  }

  useEffect(() => {
    const savedFilters = localStorage.getItem("filters");
    if (savedFilters) {
      const savedFiltersArray = JSON.parse(savedFilters);
      setSavedFilters(savedFiltersArray);
    }
  }, []);

  return (
    <>
      <header className="p-4 flex justify-left gap-4 items-center select-none">
        <a href="/" className="text-white">
          <ArrowLeft />
        </a>
        <span className="text-white">Settings</span>
      </header>
      <div className="p-4 pl-12">
        <h1>Filters</h1>
        <br />
        {savedFilters.map((filter, index) => (
          <div>
            <div className="flex gap-4" key={index}>
              <Select
                onValueChange={(value) => setRuleValue(value)}
                disabled
                value={filter.rule}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a rule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Rules</SelectLabel>
                    <SelectItem value="title-contains">
                      Title contains
                    </SelectItem>
                    <SelectItem value="title-starts-with">
                      Title starts with
                    </SelectItem>
                    <SelectItem value="title-ends-with">
                      Title ends with
                    </SelectItem>
                    <SelectItem value="author-is">Author is</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                placeholder="Enter a value"
                onInput={(e) => setValue(e.target.value)}
                disabled
                value={filter.value}
              />
              <Button onClick={() => handleRemoveRule(filter.id)}>
                Remove
              </Button>{" "}
            </div>
            <br />
            <p className="text-red-500">{error}</p>
          </div>
        ))}
        <div className="flex gap-4">
          <Select
            onValueChange={(value) => setRuleValue(value)}
            value={ruleValue || ""}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a rule" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Rules</SelectLabel>
                <SelectItem value="title-contains">Title contains</SelectItem>
                <SelectItem value="title-starts-with">
                  Title starts with
                </SelectItem>
                <SelectItem value="title-ends-with">Title ends with</SelectItem>
                <SelectItem value="author-is">Author is</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            placeholder="Enter a value"
            onInput={(e) => setValue(e.target.value)}
            value={value}
          />
          <Button onClick={handleAddRule}>Add Rule</Button>
        </div>
        <br />
        <p className="text-red-500">{error}</p>
      </div>
    </>
  );
}
