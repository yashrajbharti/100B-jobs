import { loadData } from "./module/loadData.mjs";
import { SearchBar } from "./components/search-bar.mjs";
import { CandidateCard } from "./components/candidate-card.mjs";
import { searchResults } from "./utils/search.mjs";
import { filterTopCandidates } from "./utils/filter.mjs";

customElements.define("search-bar", SearchBar);
customElements.define("candidate-card", CandidateCard);
loadData();
searchResults();
filterTopCandidates();
