import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';

enum Variant {
    primary = 'primary',
    secondary = 'secondary',
    success = 'success',
    danger = 'danger',
    warning = 'warning',
    info = 'info',
    nothing = 'nothing',
}

interface Props {
    message : string,
    heading : string,
    variant : Variant
}

function CustomAlert(props: Props) {
    let {variant, message, heading} = props;
    if (variant === Variant.nothing) {
        return (
            <div></div>
        );
    }

    return (
        <Container className='mt-3'>
            <Alert variant={`${variant}`}>
                <Alert.Heading>{`${heading}`}</Alert.Heading>
                {`${message}`}
            </Alert>
        </Container>
    )
}

export {
    CustomAlert  as Alert,
    type Props as AlertProps,
    Variant as Variant
}
