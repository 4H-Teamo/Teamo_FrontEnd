'use client';
import SearchInput from "@/app/components/searchInput/searchInput";
// import {useSearch} from "@/app/features/search/useSearch";

const Search =()=>{
	// const {search} = useSearch();
	return(
		<>
			<SearchInput readOnly={false}  className="w-full"/>
		</>
	)
}

export default Search;