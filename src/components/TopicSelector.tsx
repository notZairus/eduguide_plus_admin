import { use } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useHandbookContext } from "../contexts/HandbookContext";

const TopicSelector = () => {
  const { topics, setActiveTopic } = useHandbookContext();

  return (
    <Select
      onValueChange={(value) => {
        const selected = topics.find((topic) => topic._id === value);
        if (selected) {
          setActiveTopic(selected as Topic);
        }
      }}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select a topic." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Topics</SelectLabel>
          {topics.map((topic) => (
            <SelectItem key={topic._id} value={topic._id}>
              {topic.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TopicSelector;
