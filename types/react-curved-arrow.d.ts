declare module 'react-curved-arrow' {
  interface CurvedArrowProps {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    middleX?: number;
    middleY?: number;
    color?: string;
    strokeWidth?: number;
  }

  const CurvedArrow: React.FC<CurvedArrowProps>;
  export default CurvedArrow;
} 