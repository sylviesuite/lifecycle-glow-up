# Lifecycle Flow UI - Export Package for Manus

This document contains all the UI components, design system, and custom elements from the Lifecycle Flow project, ready to integrate into your Manus application.

---

## 📋 Table of Contents

1. [Design System Setup](#design-system-setup)
2. [UI Component Library](#ui-component-library)
3. [Custom Components](#custom-components)
4. [Flow UI Components](#flow-ui-components)
5. [Usage Examples](#usage-examples)

---

## 🎨 Design System Setup

### 1. Install Dependencies

```bash
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip class-variance-authority clsx tailwind-merge framer-motion lucide-react recharts embla-carousel-react vaul sonner react-router-dom
```

### 2. Tailwind Configuration (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

### 3. Global Styles (`index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 4. Utility Helper (`src/lib/utils.ts`)

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format large CO₂e values - use tonnes (t) for values >= 1000 kg
 */
export function formatCO2eValue(value: number, unit: string): { value: string; unit: string } {
  if (unit.includes("kg CO₂e") && value >= 1000) {
    return {
      value: (value / 1000).toFixed(2),
      unit: unit.replace("kg", "t"),
    };
  }
  return {
    value: value.toFixed(1),
    unit,
  };
}
```

---

## 🧩 UI Component Library

### Button (`src/components/ui/button.tsx`)

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

**Usage:**
```tsx
import { Button } from "@/components/ui/button";

<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost" size="sm">Small Ghost</Button>
```

### Card (`src/components/ui/card.tsx`)

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>
```

### Badge (`src/components/ui/badge.tsx`)

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
```

**Usage:**
```tsx
import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
```

### Dialog (`src/components/ui/dialog.tsx`)

```tsx
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
```

**Usage:**
```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description goes here.</DialogDescription>
    </DialogHeader>
    <div>Dialog content</div>
  </DialogContent>
</Dialog>
```

### Drawer (`src/components/ui/drawer.tsx`)

```tsx
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

const Drawer = ({ shouldScaleBackground = true, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/80", className)} {...props} />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export { Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription };
```

**Usage:**
```tsx
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

<Drawer>
  <DrawerTrigger asChild>
    <Button>Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Drawer Title</DrawerTitle>
      <DrawerDescription>Drawer description</DrawerDescription>
    </DrawerHeader>
    <div className="p-4">Drawer content</div>
    <DrawerFooter>
      <DrawerClose asChild>
        <Button variant="outline">Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

---

## 🎯 Custom Components

### FloatingParticles (`src/components/FloatingParticles.tsx`)

A beautiful animated background with floating particles.

```tsx
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const particles: Particle[] = [];
    const particleCount = 40;
    const colors = ["#09FBD3", "#FF8E4A", "#FFFFFF"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3,
        );
        gradient.addColorStop(0, particle.color + Math.floor(particle.opacity * 255).toString(16));
        gradient.addColorStop(1, particle.color + "00");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
```

**Usage:**
```tsx
import { FloatingParticles } from "@/components/FloatingParticles";

<div className="relative min-h-screen">
  <FloatingParticles />
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</div>
```

### ImpactCard (`src/components/ImpactCard.tsx`)

Displays material impact data with visual phase breakdown.

```tsx
import { formatCO2eValue } from "@/lib/utils";

interface Phase {
  label: string;
  value: number;
  color: string;
  isActive: boolean;
}

interface ImpactCardProps {
  material: { name: string; category: string; region: string };
  onClick: () => void;
  currentMetric: string;
  currentUnit: string;
  phases: Phase[];
}

export function ImpactCard({ material, onClick, currentMetric, currentUnit, phases }: ImpactCardProps) {
  const totalValue = phases.reduce((sum, phase) => sum + phase.value, 0);
  const { value: formattedValue, unit: displayUnit } = formatCO2eValue(totalValue, currentUnit);

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg"
    >
      <div className="mb-4">
        <h3 className="mb-1 text-lg font-semibold text-card-foreground">{material.name}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{material.category}</span>
          <span>•</span>
          <span>{material.region}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1 text-3xl font-bold text-card-foreground">
          {formattedValue}
          <span className="ml-2 text-lg font-normal text-muted-foreground">{displayUnit}</span>
        </div>
        <div className="text-sm text-muted-foreground">{currentMetric}</div>
      </div>

      {/* Phase breakdown mini bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/30">
        <div className="flex h-full">
          {phases.map((phase, idx) => {
            const percentage = totalValue > 0 ? (phase.value / totalValue) * 100 : 0;
            return (
              <div
                key={idx}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: phase.color,
                  opacity: phase.isActive ? 1 : 0.3,
                }}
                className="transition-all duration-300"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

**Usage:**
```tsx
<ImpactCard
  material={{ name: "Concrete", category: "Structural", region: "EU" }}
  onClick={() => console.log("Card clicked")}
  currentMetric="GWP Total"
  currentUnit="kg CO₂e/m³"
  phases={[
    { label: "A1-A3", value: 300, color: "#09FBD3", isActive: true },
    { label: "A4", value: 50, color: "#FF8E4A", isActive: true },
    // ... more phases
  ]}
/>
```

### ScoreBadge (`src/components/ui/score-badge.tsx`)

Displays colored score badges based on value ranges.

```tsx
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: string;
  label: string;
  className?: string;
}

export function ScoreBadge({ score, label, className }: ScoreBadgeProps) {
  const getScoreColor = (score: string) => {
    switch (score.toUpperCase()) {
      case "A+":
      case "A":
        return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";
      case "B":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30";
      case "C":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
      case "D":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30";
      case "E":
      case "F":
        return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg border-2 font-bold",
          getScoreColor(score),
        )}
      >
        {score}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
```

**Usage:**
```tsx
<ScoreBadge score="A+" label="Regional Impact Score" />
<ScoreBadge score="C" label="Lifecycle Impact Score" />
```

---

## 🌊 Flow UI Components

### LifecycleFlow with Progress Bar and Checkmarks

The complete multi-step flow with spring animations, progress tracking, and completion checkmarks.

```tsx
import { useState, useEffect } from "react";
import { Moon, Sun, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingParticles } from "@/components/FloatingParticles";

export function LifecycleFlow() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleNext = () => {
    if (step < 4) {
      setCompletedSteps(prev => new Set([...prev, step]));
      setDirection("forward");
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setDirection("backward");
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <div>Step 1 Content</div>;
      case 2:
        return <div>Step 2 Content</div>;
      case 3:
        return <div>Step 3 Content</div>;
      case 4:
        return <div>Step 4 Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <FloatingParticles />

      {/* Animated gradient orbs */}
      <motion.div
        className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
        animate={{
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"
        animate={{
          x: mousePosition.x * -0.02,
          y: mousePosition.y * -0.02,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />

      {/* Progress bar */}
      <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-white/10">
        <motion.div
          className="h-full"
          style={{
            background: "linear-gradient(90deg, #09FBD3 0%, #FF8E4A 100%)",
            boxShadow: "0 0 20px rgba(9, 251, 211, 0.5)",
          }}
          initial={{ width: "25%" }}
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="text-white hover:bg-white/10"
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </header>

      {/* Step Indicator */}
      <div className="relative z-10 mb-12 flex justify-center gap-4 px-6">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold transition-all duration-300"
            style={{
              background: s === step 
                ? 'linear-gradient(135deg, #09FBD3 0%, #FF8E4A 100%)' 
                : completedSteps.has(s)
                ? 'linear-gradient(135deg, #09FBD3 0%, #FF8E4A 100%)'
                : 'rgba(15, 23, 42, 0.6)',
              border: s === step || completedSteps.has(s) ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: s === step || completedSteps.has(s) ? 'none' : 'blur(10px)',
              color: s === step || completedSteps.has(s) ? '#0B0F16' : 'rgba(249, 250, 251, 0.5)',
            }}
            aria-current={s === step ? 'step' : undefined}
          >
            {completedSteps.has(s) ? (
              <Check className="h-5 w-5" strokeWidth={3} />
            ) : (
              s
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ 
              opacity: 0,
              x: direction === "forward" ? 100 : -100,
              scale: 0.95,
            }}
            animate={{ 
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{ 
              opacity: 0,
              x: direction === "forward" ? -100 : 100,
              scale: 0.95,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={step === 4}
            className="bg-gradient-to-r from-cyan-400 to-orange-400 text-slate-950 hover:opacity-90"
          >
            {step === 4 ? "Complete" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Key Features:**
- ✅ Spring physics animations (`stiffness: 300, damping: 30`)
- ✅ Animated progress bar at top showing completion percentage
- ✅ Step completion checkmarks in indicator circles
- ✅ Mouse-reactive gradient orbs
- ✅ Floating particle background
- ✅ Smooth forward/backward transitions
- ✅ Dark/light theme toggle

---

## 📚 Usage Examples

### Example 1: Basic Page with Flow

```tsx
import { LifecycleFlow } from "./components/LifecycleFlow";

function App() {
  return <LifecycleFlow />;
}
```

### Example 2: Material Cards Grid

```tsx
import { ImpactCard } from "@/components/ImpactCard";

const materials = [
  {
    material: { name: "Concrete C30/37", category: "Structural", region: "EU" },
    phases: [
      { label: "A1-A3", value: 300, color: "#09FBD3", isActive: true },
      { label: "A4", value: 50, color: "#FF8E4A", isActive: true },
    ]
  },
  // ... more materials
];

function MaterialsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {materials.map((item, idx) => (
        <ImpactCard
          key={idx}
          material={item.material}
          onClick={() => console.log("Material selected:", item.material.name)}
          currentMetric="GWP Total"
          currentUnit="kg CO₂e/m³"
          phases={item.phases}
        />
      ))}
    </div>
  );
}
```

### Example 3: Dialog with Form

```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Material</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Material</DialogTitle>
          <DialogDescription>Enter material details below.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Material Name</Label>
            <Input id="name" placeholder="e.g., Concrete C30/37" />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="e.g., Structural" />
          </div>
          <Button className="w-full">Add Material</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Example 4: Animated Background Page

```tsx
import { FloatingParticles } from "@/components/FloatingParticles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <FloatingParticles />
      
      <div className="relative z-10 container mx-auto px-6 py-20">
        <h1 className="mb-8 text-5xl font-bold text-white">
          Welcome to Lifecycle Analysis
        </h1>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Feature 1</CardTitle>
              <CardDescription className="text-white/70">
                Description of feature 1
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/60">Content here</p>
            </CardContent>
          </Card>
          {/* More cards */}
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 Design Tokens Quick Reference

### Colors
```css
/* Light mode */
--background: hsl(0 0% 100%)
--foreground: hsl(222.2 84% 4.9%)
--primary: hsl(222.2 47.4% 11.2%)
--secondary: hsl(210 40% 96.1%)
--muted: hsl(210 40% 96.1%)
--accent: hsl(210 40% 96.1%)
--destructive: hsl(0 84.2% 60.2%)

/* Dark mode */
--background: hsl(222.2 84% 4.9%)
--foreground: hsl(210 40% 98%)
--primary: hsl(210 40% 98%)
--secondary: hsl(217.2 32.6% 17.5%)
```

### Gradients
```css
/* Primary gradient */
background: linear-gradient(135deg, #09FBD3 0%, #FF8E4A 100%)

/* Subtle background */
background: linear-gradient(to-br, from-slate-950 via-slate-900 to-slate-950)
```

### Animations
```tsx
// Spring physics
transition={{ type: "spring", stiffness: 300, damping: 30 }}

// Smooth ease
transition={{ duration: 0.3, ease: "easeInOut" }}
```

---

## 🚀 Quick Start Checklist

1. ✅ Install all dependencies
2. ✅ Copy `tailwind.config.ts` configuration
3. ✅ Copy `index.css` global styles
4. ✅ Copy `src/lib/utils.ts` utility functions
5. ✅ Copy desired UI components to `src/components/ui/`
6. ✅ Copy custom components to `src/components/`
7. ✅ Import and use components in your Manus pages

---

## 💡 Tips for Manus Integration

1. **Adjust paths**: Update import paths to match your Manus project structure
2. **Check dependencies**: Ensure all Radix UI and animation libraries are installed
3. **Customize colors**: Modify the HSL values in `index.css` to match your brand
4. **Test responsiveness**: All components are mobile-friendly but verify in your layout
5. **Spring physics**: Adjust `stiffness` and `damping` values for different animation feels

---

## 📞 Need Help?

If you encounter any issues during integration:
- Check that all dependencies are installed
- Verify import paths match your project structure
- Ensure Tailwind CSS is properly configured
- Test components individually before combining

Good luck with your Manus project! 🎉
