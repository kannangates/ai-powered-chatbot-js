import { Chatbot } from "@/components/Chatbot";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Website Content</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">This is a demonstration of how the AI chatbot would integrate into your website, providing intelligent responses based on your site's content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Sample Content 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Product Features</h2>
          <p className="text-gray-600 mb-4">Our platform offers cutting-edge AI integration, blazing-fast performance, and seamless third-party compatibility.</p>
          <div className="flex justify-between items-center">
            <span className="text-primary font-medium">Learn more</span>
            <span className="text-gray-400">→</span>
          </div>
        </div>

        {/* Sample Content 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Pricing Plans</h2>
          <p className="text-gray-600 mb-4">Choose from our flexible plans: Starter ($29/mo), Pro ($79/mo), or Enterprise (custom pricing).</p>
          <div className="flex justify-between items-center">
            <span className="text-primary font-medium">View pricing</span>
            <span className="text-gray-400">→</span>
          </div>
        </div>

        {/* Sample Content 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Documentation</h2>
          <p className="text-gray-600 mb-4">Find comprehensive guides, API references, and tutorials to get started with our platform.</p>
          <div className="flex justify-between items-center">
            <span className="text-primary font-medium">Read docs</span>
            <span className="text-gray-400">→</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">How do I integrate the chatbot with my website?</h3>
            <p className="text-gray-600">Integration is simple! Just import our component, add your API keys to your environment variables, and include the ChatbotComponent in your layout file. The chatbot will then appear on all pages of your website.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Can I customize the appearance of the chatbot?</h3>
            <p className="text-gray-600">Yes, the chatbot is fully customizable. You can change colors, typography, icons, and even the layout of the chat interface to match your brand identity.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">How does the AI prioritize information sources?</h3>
            <p className="text-gray-600">The AI first attempts to find relevant information from your website content through semantic search. If it cannot find a suitable answer, it will use its general knowledge while clearly indicating that the information is not from your website.</p>
          </div>
        </div>
      </div>

      <div className="bg-primary text-white p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to enhance your website with AI?</h2>
          <p className="mb-6">Get started today and provide your users with intelligent, context-aware support 24/7.</p>
          <button className="bg-white text-primary font-semibold py-2 px-6 rounded-md shadow-sm hover:bg-gray-100 transition">
            Contact Sales
          </button>
        </div>
      </div>
      
      <Chatbot />
    </div>
  );
}
