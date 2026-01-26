import json
import os
from rich.console import Console
from rich.layout import Layout
from rich.panel import Panel
from rich.text import Text

console = Console()

class DungeonEngine:
    def __init__(self, map_path):
        with open(map_path, 'r') as f:
            self.data = json.load(f)
        self.current_id = self.data['start_node']
        self.score = 0
        self.layout = Layout()
        self.setup_layout()

    def setup_layout(self):
        self.layout.split_column(
            Layout(name="header", size=3),
            Layout(name="main", ratio=1),
            Layout(name="footer", size=6),
        )
        self.layout["main"].split_row(
            Layout(name="map", ratio=1),
            Layout(name="info", ratio=2),
        )

    def draw_ui(self, message="Enter your answer..."):
        room = self.data['rooms'][self.current_id]
        
        # Header
        self.layout["header"].update(Panel(f"TERMINAL CRAWLER | Score: [yellow]{self.score}[/]", style="bold blue"))
        
        # Map / Connections
        conn_text = "\n".join([f"• {c} ({self.data['rooms'][c]['name']})" for c in room['connections']])
        self.layout["map"].update(Panel(f"[bold cyan]Location:[/]\n{room['name']}\n\n[bold]Paths:[/]\n{conn_text}", title="Map"))
        
        # Room Info
        self.layout["info"].update(Panel(f"{room['desc']}", title="Description", padding=(1, 2)))
        
        # Footer / Input area
        footer_content = Text.from_markup(f"[bold green]QUESTION:[/] {room['question']}\n\n[dim]{message}[/]")
        self.layout["footer"].update(Panel(footer_content, title="Action Log"))
        
        os.system('cls' if os.name == 'nt' else 'clear')
        console.print(self.layout)

    def run(self):
        while True:
            room = self.data['rooms'][self.current_id]
            self.draw_ui()
            
            # 1. Answer the Question
            ans = console.input("[bold yellow]Answer > [/]")
            
            if ans.lower() == room['answer'].lower():
                self.score += 10
                
                # Check for Win
                if self.current_id == self.data['end_node']:
                    self.draw_ui("VICTORY! You reached the end.")
                    print("\nCongratulations! You escaped.")
                    break
                
                # 2. Choose Next Room
                self.draw_ui("Correct! Now choose your path...")
                print("\nAvailable Doors:")
                for i, conn in enumerate(room['connections']):
                    print(f"[{i}] {self.data['rooms'][conn]['name']}")
                
                choice = int(console.input("\n[bold cyan]Move to (Enter Number) > [/]"))
                self.current_id = room['connections'][choice]
            else:
                self.draw_ui("[bold red]Wrong![/] The door remains locked.")
                console.input("Press Enter to try again...")

if __name__ == "__main__":
    # Ensure map.json is in the same folder
    game = DungeonEngine('map.json')
    game.run()



