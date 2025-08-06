'use client'
import SearchInput from "@/app/components/searchInput/searchInput";
import Stack from "@/app/components/techStack/stack";
import {useState} from "react";


const Filter = () => {
	const [search, setSearch] = useState('');
	const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
	return (
		<div className="flex flex-col gap-10 border border-gray-300 rounded-lg p-10">
			<SearchInput readOnly={false} className="w-full" value={search} onChange={setSearch}/>
			<Stack value={[]} onChange={()=>{}} className="lg:w-full"/>
		</div>
	)
}
export default Filter;