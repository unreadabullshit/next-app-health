"use client"

import * as React from "react"
import {ParsedRouteSchema} from '@/lib/schemas'

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const routes = [
  {
    route: {
      app: "/",
      url: "/",
      ignored: false,
    },
    files: [
      {
        name: "_page.tsx",
        ignored: true,
      }, {
        name: "layout.tsx",
        ignored: false,
      }
    ],
  }, {
    route: {
      app: "/private",
      url: "/private",
      ignored: false,
    },
    files: [
      {
        name: "page.tsx",
        ignored: false,
      }
    ],
  }, {
    route: {
      app: "/private/(group)/app/somewhere",
      url: "/private/app/somewhere",
      ignored: false,
    },
    files: [
      {
        name: "page.tsx",
        ignored: false,
      }
    ],
  }, {
    route: {
      app: "/private/(group)",
      url: "/private",
      ignored: false,
    },
    files: [
      {
        name: "_page.tsx",
        ignored: true,
      }
    ],
  }, {
    route: {
      app: "/api/example",
      url: "/api/example",
      ignored: false,
    },
    files: [
      {
        name: "route.ts",
        ignored: false,
      }
    ],
  }
]

export function ComboBoxResponsive() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedRoute, setSelectedRoute] = React.useState<{
		route: ParsedRouteSchema['route'];
		files: ParsedRouteSchema['file'][];
	} | null>(
    null
  )

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            {selectedRoute ? `http://localhost:3000${selectedRoute.route.url}` : 'Select...'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="end" side="bottom">
          <RoutesList setOpen={setOpen} setSelectedRoute={setSelectedRoute} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
        {selectedRoute ? `http://localhost:3000${selectedRoute.route.url}` : 'Select...'}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle>Select route</DrawerTitle>
        <div className="mt-4 border-t">
          <RoutesList setOpen={setOpen} setSelectedRoute={setSelectedRoute} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function RoutesList({
  setOpen,
  setSelectedRoute,
}: {
  setOpen: (open: boolean) => void
  setSelectedRoute: (route: {
		route: ParsedRouteSchema['route'];
		files: ParsedRouteSchema['file'][];
	} | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="choose route..." />
      <CommandList>
        <CommandEmpty>No routes found.</CommandEmpty>
        <CommandGroup>
          {routes.map((route) => (
            <CommandItem
              key={route.route.app}
              value={route.route.app}
              onSelect={(value) => {
                setSelectedRoute(
                  routes.find((r) => r.route.app === value) || null
                )
                setOpen(false)
              }}
            >
              {route.route.url}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
