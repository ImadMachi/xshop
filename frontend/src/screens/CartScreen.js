import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button, Card, Col, Form, Image, ListGroup, Row } from "react-bootstrap";

import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cart";
import { ORDER_CREATE_RESET } from "../constants/order";

const CartScreen = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const qty = +searchParams.get("qty") || 1;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch({ type: ORDER_CREATE_RESET });
  });
  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty));
    }
  }, [dispatch, id, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Select
                      style={{ width: "100%", padding: "5px" }}
                      value={item.qty}
                      onChange={(e) => dispatch(addToCart(item.product, +e.target.value))}
                    >
                      {[...Array(item.countInStock).keys()].map((n) => (
                        <option key={n + 1} value={n + 1}>
                          {n + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Button type="button" variant="light" onClick={() => removeFromCartHandler(item.product)}>
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Subtotal ({cartItems.reduce((acc, curr) => acc + curr.qty, 0)}) items</h2>$
              {cartItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0).toFixed(2)}
            </ListGroup.Item>

            <ListGroup.Item>
              <Button type="button" className="btn-block" disabled={cartItems.length === 0} onClick={checkoutHandler}>
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
