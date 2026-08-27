import { renderToString } from "react-dom/server";
import { Command as CommandPrimitive } from "cmdk";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const tree = (
  <CommandPrimitive>
    <CommandInput placeholder="Jump to…" />
    <CommandList>
      <CommandEmpty>Nothing matches.</CommandEmpty>
      <CommandGroup heading="Navigate">
        <CommandItem value="work">Work</CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandPrimitive>
);

// Without a Command provider this throws:
//   Cannot read properties of undefined (reading 'subscribe')
const html = renderToString(tree);
console.log("rendered ok, bytes:", html.length);
console.log("has input:", html.includes('data-slot="command-input"'));
console.log("has item:", html.includes("Work"));

let threw = "";
try {
  renderToString(
    <CommandList>
      <CommandEmpty>orphan</CommandEmpty>
    </CommandList>,
  );
} catch (e) {
  threw = (e as Error).message;
}
console.log("orphan (no provider) throws as expected:", threw.slice(0, 60) || "NO — check assumption");
