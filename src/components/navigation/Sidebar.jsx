"use client"

import { useState } from "react"
import { Bell, ChevronLeft, ChevronRight, Home, LayoutDashboard, LogOut, Menu, Search, Settings, Users } from "lucide-react"
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SidebarComponent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <>
    <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            {!sidebarCollapsed && (
              <Link className="flex items-center" href="#">
                <LayoutDashboard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-lg font-semibold">Admin Dashboard</span>
              </Link>
            )}
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {sidebarCollapsed ? (
                <ChevronRight className="h-6 w-6" />
              ) : (
                <ChevronLeft className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>
          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  className={`flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${
                    sidebarCollapsed ? "justify-center" : ""
                  }`}
                  href="#"
                >
                  <Home className="h-5 w-5" />
                  {!sidebarCollapsed && <span className="ml-2">Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link
                  className={`flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${
                    sidebarCollapsed ? "justify-center" : ""
                  }`}
                  href="#"
                >
                  <Users className="h-5 w-5" />
                  {!sidebarCollapsed && <span className="ml-2">Users</span>}
                </Link>
              </li>
              <li>
                <Link
                  className={`flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${
                    sidebarCollapsed ? "justify-center" : ""
                  }`}
                  href="#"
                >
                  <Settings className="h-5 w-5" />
                  {!sidebarCollapsed && <span className="ml-2">Settings</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
     
  )
}