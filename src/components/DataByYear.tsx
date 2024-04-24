import { useEffect, useState } from "react";
import { Table } from "@mantine/core";
import jsonData from "../data/dataset.json";

// Define the structure of a single data entry in the dataset
interface DataEntry {
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": string | number;
  "Area Under Cultivation (UOM:Ha(Hectares))": string | number;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": string | number;
}

// React functional component to display data by year
const DataByYear: React.FC = () => {
  // State variables to store data and computed results
  const [data, setData] = useState<DataEntry[]>([]);
  const [yearData, setYearData] = useState<any[]>([]);
  // const [cropData, setCropData] = useState<any[]>([]);

  // Effect hook to set the data state from the JSON file when the component mounts
  useEffect(() => {
    setData(jsonData);
  }, []);

  // Function to find the crop with maximum and minimum production for each year
  const findYearMaxMin = () => {
    // Object to store maximum and minimum production crops for each year
    const yearMap: {
      [year: string]: {
        maxProduction?: string | number;
        maxCrop?: string;
        minProduction?: string | number;
        minCrop?: string;
      };
    } = {};

    // Iterate through each data entry to populate the yearMap
    data.forEach((entry) => {
      const year = entry["Year"];
      const production = entry["Crop Production (UOM:t(Tonnes))"];

      // If the year entry doesn't exist in the yearMap, initialize it
      if (!yearMap[year]) {
        yearMap[year] = {};
      }

      // Update maximum production crop for the year
      if (
        !yearMap[year].maxProduction ||
        production! > yearMap[year].maxProduction!
      ) {
        yearMap[year].maxProduction = production;
        yearMap[year].maxCrop = entry["Crop Name"];
      }

      // Update minimum production crop for the year
      if (
        !yearMap[year].minProduction ||
        production! < yearMap[year].minProduction!
      ) {
        yearMap[year].minProduction = production;
        yearMap[year].minCrop = entry["Crop Name"];
      }
    });

    // Format year data into an array of objects and set the state
    const formattedYearData = Object.entries(yearMap).map(([year, value]) => ({
      Year: year,
      "Crop with Maximum Production": value.maxCrop || "N/A",
      "Crop with Minimum Production": value.minCrop || "N/A",
    }));
    setYearData(formattedYearData);
  };

  // Function to calculate average yield and cultivation area of each crop
  // const calculateCropAverages = () => {
  //   // Object to store total yield, area, and count for each crop
  //   const cropMap: {
  //     [crop: string]: { totalYield: number; totalArea: number; count: number };
  //   } = {};

  //   // Iterate through each data entry to populate the cropMap
  //   data.forEach((entry) => {
  //     const crop = entry["Crop Name"];
  //     const yieldProperty =
  //       "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))" as keyof DataEntry;
  //     const areaProperty = "Area Under Cultivation (UOM:Ha(Hectares))";

  //     // If the crop entry doesn't exist in the cropMap, initialize it
  //     if (!cropMap[crop]) {
  //       cropMap[crop] = {
  //         totalYield: 0,
  //         totalArea: 0,
  //         count: 0,
  //       };
  //     }

  //     // Accumulate yield, area, and count for the crop
  //     cropMap[crop].totalYield += Number(entry[yieldProperty]);
  //     cropMap[crop].totalArea += Number(entry[areaProperty]);
  //     cropMap[crop].count += 1;
  //   });

  //   // Format crop data into an array of objects and set the state
  //   const formattedCropData = Object.entries(cropMap).map(([crop, value]) => ({
  //     Crop: crop,
  //     "Average Yield of the Crop": (value.totalYield / value.count).toFixed(3),
  //     "Average Cultivation Area of the Crop": (
  //       value.totalArea / value.count
  //     ).toFixed(3),
  //   }));
  //   setCropData(formattedCropData);
  // };

  // Effect hook to call the computation functions when data changes
  useEffect(() => {
    findYearMaxMin();
    // calculateCropAverages();
  }, [data]);

  // Table rows for year data
  const yearRows = yearData.map((entry, index) => (
    <Table.Tr key={index}>
      <Table.Td>{entry.Year}</Table.Td>
      <Table.Td>{entry["Crop with Maximum Production"]}</Table.Td>
      <Table.Td>{entry["Crop with Minimum Production"]}</Table.Td>
    </Table.Tr>
  ));

  // Render the component
  return (
    <div className="wrapper">
      <Table.ScrollContainer className="year_table" minWidth={200}>
        <Table stickyHeader stickyHeaderOffset={0} striped stripedColor="cyan">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Year</Table.Th>
              <Table.Th>Crop with Maximum Production</Table.Th>
              <Table.Th>Crop with Minimum Production</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{yearRows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  );
};

export default DataByYear;
