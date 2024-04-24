import React, { useEffect, useState } from "react";
import { Table } from "@mantine/core";
import jsonData from "../data/dataset.json";

// Define the structure of a single data entry in the dataset
interface DataEntry {
  Country: string;
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": string | number;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": string | number;
  "Area Under Cultivation (UOM:Ha(Hectares))": string | number;
}

// Define the structure of data for each crop
interface CropData {
  cropName: string; // Name of the crop
  averageYield: string; // Average yield of the crop between 1950-2020
  averageArea: string; // Average cultivation area of the crop between 1950-2020
  [key: string]: string; // Index signature to allow any other string keys
}

// React functional component to display data by crop
const DataByCrop: React.FC = () => {
  // State to store data calculated by crop
  const [dataByCrop, setDataByCrop] = useState<CropData[]>([]);

  // Effect hook to calculate averages when component mounts
  useEffect(() => {
    // Function to calculate average yield and area for each crop
    const calculateAverages = (data: DataEntry[]) => {
      // Object to store accumulated yield, area, and count for each crop
      const crops: {
        [key: string]: { yield: number; area: number; count: number };
      } = {};

      // Iterate through each data entry
      for (const entry of data) {
        // Destructure data entry
        const {
          "Crop Name": cropName,
          "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": yieldValue,
          "Area Under Cultivation (UOM:Ha(Hectares))": area,
        } = entry;

        // If crop is encountered for the first time, initialize its properties
        if (!crops[cropName]) {
          crops[cropName] = { yield: 0, area: 0, count: 0 };
        }

        // Accumulate yield, area, and count for the crop
        crops[cropName].yield += yieldValue ? Number(yieldValue) : 0;
        crops[cropName].area += area ? Number(area) : 0;
        crops[cropName].count++;
      }

      // Convert accumulated data to an array of CropData objects
      const dataByCrop: CropData[] = Object.entries(crops).map(
        ([cropName, { yield: yieldProp, area, count }]) => ({
          cropName,
          averageYield: (yieldProp / count).toFixed(3),
          averageArea: (area / count).toFixed(3),
        })
      );

      // Set the state with the calculated data by crop
      setDataByCrop(dataByCrop);
    };

    // Calculate averages from the provided JSON data
    calculateAverages(jsonData as DataEntry[]);
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  // Table column configuration
  const columns = [
    { title: "Crop", key: "cropName" },
    {
      title: "Average Yield of the Crop between 1950-2020",
      key: "averageYield",
    },
    {
      title: "Average Cultivation Area of the Crop between 1950-2020",
      key: "averageArea",
    },
  ];

  // Table rows
  const rows = dataByCrop.map((entry) => (
    <Table.Tr key={entry.cropName}>
      {columns.map((column) => (
        <Table.Td key={column.key}>{entry[column.key]}</Table.Td>
      ))}
    </Table.Tr>
  ));

  // Render the component
  return (
    <div className="wrapper">
      <Table.ScrollContainer className="year_table" minWidth={200}>
        <Table stickyHeader stickyHeaderOffset={0} striped stripedColor="cyan">
          <Table.Thead>
            <Table.Tr>
              {/* Render table headers */}
              {columns.map((column) => (
                <Table.Th key={column.key}>{column.title}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody> {/* Render table body with rows */}
        </Table>
      </Table.ScrollContainer>
    </div>
  );
};

export default DataByCrop; // Export the component
