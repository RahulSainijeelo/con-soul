import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Service } from "@/lib/data";

interface ServiceCardProps {
  service: Service;
  onView: (service: Service) => void;
}

export function ServiceCard({ service, onView }: ServiceCardProps) {
  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 min-w-[280px] max-w-xs w-full flex-shrink-0 group"
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={service.imageUrl}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="pb-3">
        <CardTitle
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-heading)",
            fontSize: "1.25rem",
            fontWeight: "600",
          }}
        >
          {service.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-4">
        <CardDescription
          className="text-base leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {service.description}
        </CardDescription>
      </CardContent>

      <CardFooter className="pt-0 flex justify-center p-[1.5rem]">
        <Button
          variant="outline"
          className="w-full group/btn transition-all duration-300"
          onClick={() => onView(service)}
          style={{
            backgroundColor: "transparent",
            borderColor: "var(--color-accent)",
            color: "var(--color-text-primary)",
            borderRadius: "var(--radius-md)",
            padding: "0.75rem 1rem",
            fontWeight: "500",
            transition: "var(--transition-normal)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-accent)";
            e.currentTarget.style.color = "var(--color-primary-900)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--color-text-primary)";
          }}
        >
          <span className="mr-2">View Details</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
