import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverable = false
}) => {
  const { colors } = useTheme();
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-card overflow-hidden transition-all duration-300 ${
        hoverable ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

const CardImage: React.FC<CardImageProps> = ({ src, alt, className = '' }) => {
  return <img src={src} alt={alt} className={`w-full h-48 object-cover ${className}`} />;
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return <h3 className={`text-lg font-semibold mb-2 ${className}`}>{children}</h3>;
};

interface CardTextProps {
  children: React.ReactNode;
  className?: string;
}

const CardText: React.FC<CardTextProps> = ({ children, className = '' }) => {
  return <p className={`text-gray-600 ${className}`}>{children}</p>;
};

type CardComponent = React.FC<CardProps> & {
  Body: React.FC<CardBodyProps>;
  Image: React.FC<CardImageProps>;
  Title: React.FC<CardTitleProps>;
  Text: React.FC<CardTextProps>;
};

const CardWithSubcomponents = Card as CardComponent;

CardWithSubcomponents.Body = CardBody;
CardWithSubcomponents.Image = CardImage;
CardWithSubcomponents.Title = CardTitle;
CardWithSubcomponents.Text = CardText;

export default CardWithSubcomponents;