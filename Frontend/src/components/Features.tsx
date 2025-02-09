import { Activity, Brain, Target, Trophy } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    title: 'Track Carbon Footprints',
    description: 'Effortlessly log activities and calculate emissions in real-time with our intuitive tracking system.',
    icon: 'Activity',
  },
  {
    title: 'AI Analysis',
    description: 'Get personalized insights and recommendations powered by advanced machine learning algorithms.',
    icon: 'Brain',
  },
  {
    title: 'Set Challenges & Goals',
    description: 'Join community challenges or create personal goals to make a bigger impact together.',
    icon: 'Target',
  },
  {
    title: 'Gamification',
    description: 'Turn sustainability into an engaging journey with rewards, badges, and friendly competition.',
    icon: 'Trophy',
  },
];

const IconComponent = ({ name }: { name: string }) => {
  switch (name) {
    case 'Activity':
      return <Activity className="h-6 w-6 text-green-600" />;
    case 'Brain':
      return <Brain className="h-6 w-6 text-green-600" />;
    case 'Target':
      return <Target className="h-6 w-6 text-green-600" />;
    case 'Trophy':
      return <Trophy className="h-6 w-6 text-green-600" />;
    default:
      return null;
  }
};

export const Features = () => {
  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold">
            <span className="gradient-text">Features</span> that empower your
            <br className="hidden sm:block" /> sustainability journey
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to understand and reduce your carbon footprint, all in one place.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card-hover bg-white rounded-2xl shadow-md p-8"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative">
                  <div className="absolute -top-4 -left-4">
                    <div className="rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 p-4">
                      <IconComponent name={feature.icon} />
                    </div>
                  </div>
                </div>
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};