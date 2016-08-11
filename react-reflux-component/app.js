const React = require('react');
const ReactDom = require('react-dom');
const Reflux = require('reflux');
const RefluxComponent = require('./src/js/RefluxComponent');

var CharacterActions = {
    createCharacter: Reflux.createAction(),
    fightCharacter: Reflux.createAction()
};

var CharacterStore = Reflux.createStore({

    init() {
        this.characters = [];
        this.listenTo(CharacterActions.createCharacter, this.addCharacter);
    },

    addCharacter(character) {
        this.characters.push(character);
        this.trigger(character);
    }

});

class Demo extends RefluxComponent {

    constructor(props) {
        super(props);

        this.state = {
            character: "",
            power: undefined
        };
        // Since we're extending RefluxComponent, we're now able to call some useful functions
        this.listenToStore(CharacterStore, this.onStoreUpdate);
        this.listenToAction(CharacterActions.fightCharacter, this.onFightCharacter);
    }

    onStoreUpdate = () => this.forceUpdate();
    onChangeCharacter = (e) => this.setState({ character: e.target.value });
    onFightCharacter = (power) => this.setState({ power : power });

    addCharacter = () => CharacterActions.createCharacter(this.state.character);
    fightCharacter = () => CharacterActions.fightCharacter(-10);

    render = () => (
        <div>
            <input type="text" value={this.state.character} onChange={this.onChangeCharacter}/>
            <br/>
            <br/>
            <button onClick={this.addCharacter}>Add new character</button>
            <button onClick={this.fightCharacter}>Fight character !</button>
            { this.state.power ? `Attack character with ${this.state.power}` : null }
            { CharacterStore.characters.map( (c) => <div key={c}>{c}</div> ) }
        </div>
    );
}

ReactDom.render(<Demo />, document.getElementById('wrapper'));
