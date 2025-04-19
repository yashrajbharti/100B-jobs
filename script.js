import { loadData } from "./module/loadData.mjs";
import { SearchBar } from "./components/search-bar.mjs";
import { CandidateCard } from "./components/candidate-card.mjs";
import { PaginationComponent } from "./components/pagination-component.mjs";
import { searchResults } from "./utils/search.mjs";
import { filterTopCandidates } from "./utils/filter.mjs";
import { navigatePagination } from "./utils/paginate.mjs";

customElements.define("search-bar", SearchBar);
customElements.define("candidate-card", CandidateCard);
customElements.define("pagination-component", PaginationComponent);

loadData();
searchResults();
filterTopCandidates();
navigatePagination();
