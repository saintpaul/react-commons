import React from 'react';
import Reflux from 'reflux';
import PropTypes from 'prop-types';

import {Compose} from '../src';


function getRandomInt(min = 0 , max = 100) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


const UserActions = {
    getRandomNumber: Reflux.createAction({ asyncResult: true }),
    getName: Reflux.createAction({ asyncResult: true }),
    getChildrenNames: Reflux.createAction({ asyncResult: true })
};

UserActions.getRandomNumber.listen(function() {
    setTimeout(() => {
        this.completed(getRandomInt());
    }, 2000);
});

UserActions.getName.listen(function() {
    setTimeout(() => {
        this.completed({
            firstName : "Homer",
            lastName : "Simpson",
        });
    }, 500);
});

UserActions.getChildrenNames.listen(function() {
    setTimeout(() => {
        this.completed(["Lisa", "Bart", "Maggie"]);
    }, 1000);
});


class UserPureView extends React.Component {

    static propTypes = {
        randomNumber : PropTypes.number,
        name : PropTypes.string,
        childrenNames : PropTypes.arrayOf(PropTypes.string),
    };

    render() {
        return(
            <div>
                <h1>Demo composer</h1>
                <div>
                    Random number : {this.props.randomNumber}
                </div>
                <div>
                    Name : {this.props.name}
                </div>
                <div>
                    Children names : {this.props.childrenNames.slice(0, 10).join(', ')}
                </div>
            </div>
        );
    }
}

const UserComposedView = Compose(UserPureView)
    .listenTo({
        randomNumber  : UserActions.getRandomNumber,
        name          : UserActions.getName,
        childrenNames : UserActions.getChildrenNames
    })
    .mapResultsToProps(({ randomNumber, name, childrenNames }) => ({
        randomNumber,
        childrenNames,
        name : `${name.firstName} ${name.lastName}`
    }))
    .withLoader()
    .willMount(() => {
        UserActions.getName();
        UserActions.getChildrenNames();
        setInterval(UserActions.getRandomNumber, 5000)
    });

export default UserComposedView;