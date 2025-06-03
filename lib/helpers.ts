import Customers from "@/models/Customers";
import { connectToMongoDB } from "./mongodb";
import {Segment, Rule} from "@/types";

export async function calculateAudience(segment: Segment) {
  await connectToMongoDB();

  let allCustomers = await Customers.find({}).lean();
  let filteredCustomers = allCustomers as Array<{ _id: any; [key: string]: any }>;

  segment.rules.forEach((rule, index) => {
    if (!rule.value) return;

    const condition = (customer: any): boolean => {
      switch (rule.field) {
        case "totalSpent":
          return rule.operator === ">"
            ? customer.totalSpent > parseFloat(rule.value)
            : customer.totalSpent < parseFloat(rule.value);
        case "visits":
          return rule.operator === ">"
            ? customer.visits > parseInt(rule.value)
            : customer.visits < parseInt(rule.value);
        case "lastVisit":
          const date = new Date(rule.value);
          return rule.operator === ">"
            ? new Date(customer.lastVisit) > date
            : new Date(customer.lastVisit) < date;
        default:
          return true;
      }
    };

    if (index === 0 || !rule.connector || rule.connector === "AND") {
      filteredCustomers = filteredCustomers.filter(condition);
    } else if (rule.connector === "OR") {
      const orMatches = allCustomers.filter(condition);
      const seen = new Set(filteredCustomers.map((c) => (c as { _id: any })._id.toString()));
      filteredCustomers = [
        ...filteredCustomers,
        ...orMatches.filter((c: { _id: any }) => !seen.has(c._id.toString())),
      ];
    }
  });
  return filteredCustomers;
}

