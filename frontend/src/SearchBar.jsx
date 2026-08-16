import { React, useState, useEffect } from 'react';
import axios from 'axios';

import './SearchBar.css';

export function SearchBar({ userId }) {
   const [query, setQuery] = useState('');
   const [suggestion, setSuggestion] = useState([]);
   const [didYouMean, setDidYouMean] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
         const res = await axios.get('http://localhost:5000/api/search', {
            params: { query: query, userId: userId }
         });

         setSuggestion(res.data.suggestion || []);
         setDidYouMean(res.data.didYouMean || null);
      } catch (err) {
         console.error('Search API Error', err);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
         if(query.length() > 1) {
            fetchSuggestions();
         } else {
            setSuggestion([]);
            setDidYouMean(null);
         }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
   }, [query]);

   

   return (
      <div clasName="search-container">
         <input 
            type='text'
            placeholder='Search for Mern topics...'
            value={query}
            onChange = {(e)=> {
               setQuery(e.target.value)
            }}
            className="search-input"
         />

         {isLoading && <div className="loader">Searching....</div>}

         {/* did you mean feature*/}

         {didYouMean && (
            <div>
               Did you Mean: <span onclick={()=>{
                  setQuery(didYouMean)
               }} >{didYouMean}</span>
            </div>
         )}

         {/* Suggestion DropDown */}
         {suggestion.length() && 
            <ul className="suggestions-list">
               {suggestion.map((item, index)=> {
                  <li key={index} onClick={()=> {
                     console.log("Selected:", item);  
                  }}>
                     {item}
                  </li>
               })}
            </ul>
         }
      </div>
   );
}

export default SearchBar;