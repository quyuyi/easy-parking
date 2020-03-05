import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            autoComplete: []
        };
    }

    componentDidMount() {
        document.getElementById('input-destination').addEventListener('keypress', () => {
            let that = document.getElementById('input-destination');
            clearTimeout(that.timeoutRegister);
            that.timeoutRegister = setTimeout(async () => {
                const data = await this.props.fetchResponse();
                this.setState({ autoComplete: data });
            }, 800);
        });
    }

    componentWillUnmount() {
        document.getElementById('input-destination').removeEventListener('keypress');
    }

    render() {
        return (
            <Container>
                <Form noValidate validated={this.state.validated}
                    className='row input-fields'
                    onSubmit={ e => this.handleSearchRequest(e) }
                >
                    <div className='col-6 col-sm-7'>
                        <Form.Group controlId='input-destination'>
                            <Form.Control type='text' placeholder='Your destination' required/>
                            <Form.Control.Feedback type='invalid'
                                className='alert alert-danger'
                            >
                                Please choose a destination.
                            </Form.Control.Feedback>
                            <Form.Text> {
                                this.state.autoComplete.slice(0, 5).map((e, i) => (
                                    <Alert key={i} variant='info'
                                        onClick={ e => this.autoFill(e) }
                                    >
                                        {e.title}
                                    </Alert>
                                ))
                            } </Form.Text>
                        </Form.Group>
                    </div>
                    <div className='col-2'>
                        <Form.Group controlId='input-distance'>
                            <Form.Control as='select' required>
                                <option>Within</option>
                                { Object.keys(this.props.rangeMapping).map((e, i) => <option key={i}>{e}</option>) }
                            </Form.Control>
                            <Form.Control.Feedback type='invalid'
                                className='alert alert-danger'
                            >
                                Please choose a distance range.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                    <div className='col-3'>
                        <Button ref={ b => this.submitButton = b }
                            variant='success' type='submit'>
                            Search
                        </Button>
                    </div>
                </Form>
            </Container>
        );
    }

    autoFill = e => {
        document.getElementById('input-destination').value = e.currentTarget.innerText;
        this.setState({ autoComplete: [] });
    }

    handleSearchRequest = e => {
        e.preventDefault();
        let field = document.getElementById('input-distance');
        if (field.value === 'Within') {
            field.classList.add('is-invalid');
            return;
        }
        this.setState({ validated: true });
        if (!e.currentTarget.checkValidity()) {
            e.stopPropagation();
            field.classList.remove('is-invalid');
            return;
        }
        field.classList.remove('is-invalid');
        // validation finished, submit request
        this.setState({ autoComplete: [] });
        this.props.submitSearchRequest(this.submitButton);
    }
}

export default SearchForm;
