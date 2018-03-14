package es.ucm.fdi.iw.controller;

import java.security.Principal;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller	
public class RootController {

	private static Logger log = Logger.getLogger(RootController.class);
	
    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("s", "/static");
    }

	@GetMapping({"/", "/index"})
	public String root(Model model, Principal principal) {
		log.info(principal.getName() + " de tipo " + principal.getClass());		
		// org.springframework.security.core.userdetails.User
		return "home";
	}
	
	@GetMapping("/login")
	public String login() {
		return "login";
	}
	
	@GetMapping("/logout")
	public String logout() {
		return "logout";
	}
	
	@GetMapping("/upload")
	public String upload() {
		return "upload";
	}
	
	@GetMapping("/results")
	public String results() {
		return "results";
	}
	
	@GetMapping("/playing")
	public String playing() {
		return "playing";
	}
	
	@GetMapping("/map-design")
	public String map_design() {
		return "map-design";
	}

	@GetMapping("/code-design")
	public String code_design() {
		return "code-design";
	}
	
	@GetMapping("/profile")
	public String profile() {
		return "profile";
	}
	
	@GetMapping("/settings")
	public String settings() {
		return "settings";
	}
	
	@GetMapping("/ranking")
	public String ranking() {
		return "ranking";
	}
	
}
