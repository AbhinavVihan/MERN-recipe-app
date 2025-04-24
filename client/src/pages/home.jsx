import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, Button, Card, message, Modal } from "antd";
import { SaveOutlined, CheckOutlined, DownOutlined, MessageOutlined, ShareAltOutlined } from "@ant-design/icons";
import Navbar from "../components/Navbar.jsx";
import "../styles/home.css";
import { useSelector } from "react-redux";
import API_BASE_URL from "../constant.js";
import RecipeDetailsModal from "../components/RecipeDetailsModal.jsx";

const { Meta } = Card;

const Chatbot = ({ visible, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const getBotResponse = (userMessage) => {
        const message = userMessage.toLowerCase().trim();

        // Greetings and general
        if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
            return "Hi there! I'm your recipe assistant. Ask me for recipe ideas, cooking tips, or anything food-related!";
        }

        // Recipe suggestions
        if (message.includes("suggest") || message.includes("recipe") || message.includes("what should i cook")) {
            if (message.includes("quick")) {
                return "For a quick meal, try a Caprese Salad: fresh tomatoes, mozzarella, basil, olive oil, and balsamic vinegar. Ready in 10 minutes!";
            } else if (message.includes("dinner")) {
                return "How about Chicken Stir-Fry? Sauté chicken, bell peppers, broccoli, and soy sauce. Serve with rice for a hearty dinner!";
            } else if (message.includes("breakfast")) {
                return "Try Avocado Toast: mash avocado on toasted bread, add a sprinkle of salt, pepper, and optional eggs or tomatoes.";
            } else if (message.includes("dessert")) {
                return "Make Chocolate Chip Cookies: mix flour, sugar, butter, eggs, and chocolate chips, then bake at 375°F for 10 minutes.";
            } else {
                return "I suggest a classic Margherita Pizza: tomato sauce, mozzarella, basil, and a crispy dough. Bake at 450°F for 12 minutes!";
            }
        }

        // Specific dishes
        if (message.includes("pizza")) {
            return "To make a pizza, spread tomato sauce on dough, add mozzarella and toppings like pepperoni or veggies, then bake at 450°F for 10-12 minutes.";
        }
        if (message.includes("pasta")) {
            return "For Spaghetti Aglio e Olio, sauté garlic in olive oil, toss with cooked spaghetti, red pepper flakes, and parsley. Simple and delicious!";
        }
        if (message.includes("salad")) {
            return "Make a Caesar Salad: romaine lettuce, croutons, Parmesan, and Caesar dressing. Add grilled chicken for extra protein!";
        }
        if (message.includes("soup")) {
            return "Try Tomato Soup: simmer canned tomatoes, onion, garlic, and vegetable broth, then blend until smooth. Serve with grilled cheese!";
        }
        if (message.includes("cake")) {
            return "For a Vanilla Cake, mix flour, sugar, eggs, butter, milk, and vanilla extract. Bake at 350°F for 25-30 minutes and frost as desired.";
        }

        // Cuisines
        if (message.includes("italian")) {
            return "Italian cuisine shines with dishes like Lasagna: layer pasta, ricotta, mozzarella, and meat sauce, then bake until bubbly.";
        }
        if (message.includes("mexican")) {
            return "Try Tacos: fill corn tortillas with seasoned beef or chicken, top with salsa, cheese, lettuce, and avocado.";
        }
        if (message.includes("indian")) {
            return "Make Butter Chicken: cook chicken in a spiced tomato, butter, and cream sauce. Serve with naan or rice.";
        }
        if (message.includes("asian") || message.includes("chinese")) {
            return "For Fried Rice, stir-fry cooked rice with veggies, soy sauce, scrambled eggs, and optional shrimp or chicken.";
        }

        // Dietary preferences
        if (message.includes("vegan")) {
            return "Try a Vegan Buddha Bowl: quinoa, roasted chickpeas, avocado, spinach, and a tahini dressing. Nutritious and colorful!";
        }
        if (message.includes("gluten-free")) {
            return "Make Gluten-Free Pancakes: use almond flour, eggs, banana, and baking powder. Cook on a griddle and serve with maple syrup.";
        }
        if (message.includes("low-carb") || message.includes("keto")) {
            return "Try Keto Cauliflower Fried Rice: swap rice for riced cauliflower, add eggs, veggies, and soy sauce for a low-carb meal.";
        }
        if (message.includes("healthy")) {
            return "For a healthy meal, grill salmon with lemon and herbs, and serve with steamed broccoli and quinoa.";
        }

        // Ingredient substitutions
        if (message.includes("substitute") || message.includes("replace")) {
            if (message.includes("butter")) {
                return "You can substitute butter with coconut oil or applesauce in baking for a healthier or vegan option.";
            } else if (message.includes("milk")) {
                return "Replace milk with almond milk, oat milk, or soy milk for a dairy-free alternative.";
            } else if (message.includes("egg")) {
                return "For eggs, use mashed banana or flaxseed mixed with water as a vegan binding agent in baking.";
            } else {
                return "Let me know which ingredient you want to substitute, and I’ll suggest an alternative!";
            }
        }

        // Cooking tips
        if (message.includes("tip") || message.includes("how to")) {
            if (message.includes("knife") || message.includes("cut")) {
                return "To chop veggies evenly, use a sharp knife and curl your fingers under to protect them while cutting.";
            } else if (message.includes("bake")) {
                return "For even baking, rotate your tray halfway through and ensure your oven is preheated fully.";
            } else if (message.includes("season")) {
                return "Season in layers: add salt and spices at each cooking stage to build flavor.";
            } else {
                return "Always taste as you cook to adjust seasoning, and use fresh herbs at the end for a flavor boost!";
            }
        }

        // Miscellaneous
        if (message.includes("time") || message.includes("how long")) {
            return "Cooking times vary, but most dishes like pasta take 8-12 minutes to boil, or baking a cake takes 25-35 minutes at 350°F. What are you making?";
        }
        if (message.includes("ingredient") || message.includes("what do i need")) {
            return "For most recipes, you’ll need basics like olive oil, salt, pepper, and garlic. Tell me the dish, and I’ll list specific ingredients!";
        }
        if (message.includes("thank") || message.includes("thanks")) {
            return "You’re welcome! Happy cooking!";
        }

        // Fallback
        return "I’m not sure about that one. Try asking for a recipe, cooking tip, or ingredient substitution, and I’ll help you out!";
    };

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);

        const botResponse = getBotResponse(input);
        setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);

        setInput("");
    };

    return (
        <Modal
            title="Recipe Chatbot"
            visible={visible}
            onCancel={onClose}
            footer={null}
            className="chatbot-modal"
        >
            <div className="chatbot-container">
                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chatbot-message ${
                                msg.sender === "user" ? "user-message" : "bot-message"
                            }`}
                        >
                            <span>{msg.text}</span>
                        </div>
                    ))}
                </div>
                <div className="chatbot-input">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Ask about recipes..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </Modal>
    );
};

export default function Home() {
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedRecipeDetails, setSelectedRecipeDetails] = useState({});
    const [chatbotVisible, setChatbotVisible] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const userID = currentUser.data.data.user._id;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/recipe`);
                setRecipes(response.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchSavedRecipes = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/recipe/savedRecipes/ids/${userID}`
                );
                setSavedRecipes(response.data.data.savedRecipes);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRecipes();
        fetchSavedRecipes();
    }, [userID]);

    const saveRecipe = async (recipeID) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/v1/recipe/save`,
                {
                    recipeID,
                    userID,
                }
            );
            setSavedRecipes(response.data.data.savedRecipes);
            message.success("Recipe saved!");
        } catch (err) {
            console.error(err);
            message.error("Failed to save recipe");
        }
    };

    const shareRecipe = async (recipe) => {
        const shareUrl = `${window.location.origin}/recipe/${recipe._id}`;
        const shareData = {
            title: recipe.name,
            text: `Check out this delicious recipe for ${recipe.name}!`,
            url: shareUrl,
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                message.success("Recipe shared successfully!");
            } else {
                await navigator.clipboard.writeText(shareUrl);
                message.success("Recipe link copied to clipboard!");
            }
        } catch (error) {
            console.error("Error sharing recipe:", error);
            message.error("Failed to share recipe");
        }
    };

    const isRecipeSaved = (id) => savedRecipes.includes(id);

    const truncateDescription = (description) => {
        const words = description.split(" ");
        if (words.length > 10) {
            return words.slice(0, 10).join(" ") + "...";
        }
        return description;
    };

    const getMoreDetailsOfRecipe = async (recipeId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/v1/recipe/${recipeId}`
            );
            setSelectedRecipeDetails(response.data.data);
            setDetailsModalVisible(true);
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch recipe details");
        }
    };

    const closeModal = () => {
        setDetailsModalVisible(false);
        setSelectedRecipeDetails({});
    };

    return (
        <>
            <Navbar />
            <div className="homeContainer container relative">
                <p className="sectionHeading">Recipes</p>
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 3,
                        xl: 4,
                    }}
                    dataSource={recipes}
                    renderItem={(recipe) => (
                        <List.Item>
                            <Card
                                className="recipeCard"
                                title={recipe.name}
                                cover={<img alt={recipe.name} src={recipe.recipeImg} />}
                                actions={[
                                    <Button
                                        type="primary"
                                        icon={
                                            isRecipeSaved(recipe._id) ? (
                                                <CheckOutlined />
                                            ) : (
                                                <SaveOutlined />
                                            )
                                        }
                                        onClick={() => saveRecipe(recipe._id)}
                                        disabled={isRecipeSaved(recipe._id)}
                                    >
                                        {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                                    </Button>,
                                    <Button
                                        type="primary"
                                        icon={<DownOutlined />}
                                        onClick={() => getMoreDetailsOfRecipe(recipe._id)}
                                    >
                                        Read More
                                    </Button>,
                                    <Button
                                        type="primary"
                                        icon={<ShareAltOutlined />}
                                        onClick={() => shareRecipe(recipe)}
                                    >
                                        Share
                                    </Button>,
                                ]}
                            >
                                <Meta
                                    description={truncateDescription(recipe.description)}
                                />
                            </Card>
                        </List.Item>
                    )}
                />
                <RecipeDetailsModal
                    visible={detailsModalVisible}
                    onCancel={closeModal}
                    recipeDetails={selectedRecipeDetails}
                />
                <Button
                    type="primary"
                    shape="circle"
                    icon={<MessageOutlined />}
                    size="large"
                    className="chatbot-button"
                    onClick={() => setChatbotVisible(true)}
                />
                <Chatbot
                    visible={chatbotVisible}
                    onClose={() => setChatbotVisible(false)}
                />
            </div>
        </>
    );
}