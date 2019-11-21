import Component from '../Component.js';
class Search extends Component {

    onRender(dom) {
        const form = dom.querySelector('.search-form');
        const resetButton = dom.querySelector('.reset-button');
        const onSearchSubmit = this.props.onSearchSubmit;

        form.addEventListener('submit', event => {
            event.preventDefault();
            //const { hikes } = this.props;
            const hikes = JSON.parse(localStorage.getItem('allHikes'));
            const formData = new FormData(form);

            localStorage.setItem('difficulty', formData.get('difficulty'));
            localStorage.setItem('rating', formData.get('rating'));
            localStorage.setItem('length', formData.get('length'));

            let filteredDifficultyResultsArray;

            const makeDifficultyArray = () => {
                if (formData.get('difficulty') === 'any') {  
                    filteredDifficultyResultsArray = hikes;
                } else {
                    filteredDifficultyResultsArray = hikes.filter(hike => (hike.difficulty === formData.get('difficulty')));
                }
                return filteredDifficultyResultsArray;
            };

            makeDifficultyArray();

            const filteredRatingResultsArray = hikes.filter(hike => (hike.stars >= formData.get('rating')));

            let filteredLengthResultsArray;

            const makeLengthArray = () => {
                if (!formData.get('length')) {
                    filteredLengthResultsArray = hikes;
                } else {
                    filteredLengthResultsArray = hikes.filter(hike => (hike.length <= formData.get('length')));
                }
                return filteredLengthResultsArray;
            };

            makeLengthArray();

            const foundInTwo = filteredDifficultyResultsArray.filter(element => filteredRatingResultsArray.includes(element));


            
            const foundInAll = foundInTwo.filter(element => filteredLengthResultsArray.includes(element));

            onSearchSubmit(foundInAll);

        });

        resetButton.addEventListener('click', () => {
            const hikes = JSON.parse(localStorage.getItem('allHikes'));
            onSearchSubmit(hikes);
            form.reset();
        }
        );
    }

    renderHTML() {
        const difficulty = localStorage.getItem('difficulty') || 'any';

        const optionValues = [['any', 'All Levels'], ['green', 'Easiest'], ['greenBlue', 'Easy'], ['blue', 'Medium'], ['blueBlack', 'Hard'], ['black', 'Hardest']];

        const optionValuesString = optionValues.map(array => `<option value=${array[0]} ${difficulty === array[0] ? 'selected=true' : '' }>${array[1]}</option>`).reduce((acc, optionString) => acc + optionString, '');

        const rating = parseInt(localStorage.getItem('rating')) || 1;

        const ratingsArray = [1, 2, 3, 4, 5];

        const ratingValuesString = ratingsArray.map(value=> `<option value=${value} ${rating === value ? 'selected=true' : '' }>${value}</option>`).reduce((acc, valuesString) => acc + valuesString, '');

        const length = parseInt(localStorage.getItem('length'));
        console.log(length, 'length');
        return /*html*/`
        <div>
            <form class="search-form">
                <section class="search-box">
                    <input name="search" placeholder="City, State" value="">
                </section>
                <section class="difficulty">
                    <label>Difficulty:
                    <select name="difficulty">
                        ${optionValuesString}
                    </select>
                    </label>
                </section>
                <section class="rating">
                    <label>Minimum Rating:
                        <select name="rating">
                        ${ratingValuesString}
                        </select>
                    </label>
                </section>
                <section class="length">
                    <label>Max Length
                    <input class="max-length" type="number" min="0" name="length" value=${length}>
                </section>
                <section class="buttons">
                    <button>Filter Search</button>
                    <button class = "reset-button"><a href = "../hikes.html">Reset Filters</a></button>
                </section>
            </form>
        </div>
        `;
    }
}

export default Search;

